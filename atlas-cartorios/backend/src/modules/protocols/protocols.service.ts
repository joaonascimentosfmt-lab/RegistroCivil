import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { ProtocolFilterDto } from './dto/protocol-filter.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { ProtocolStatus } from '@prisma/client';

@Injectable()
export class ProtocolsService {
  private readonly logger = new Logger(ProtocolsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createProtocolDto: CreateProtocolDto) {
    const numero = await this.generateProtocolNumber();

    const protocol = await this.prisma.protocol.create({
      data: {
        numero,
        serviceType: createProtocolDto.serviceType,
        escreventeId: createProtocolDto.escreventeId,
        observacoes: createProtocolDto.observacoes,
        valor: createProtocolDto.valor,
        parties: createProtocolDto.partyIds?.length
          ? { create: createProtocolDto.partyIds.map((personId) => ({ personId })) }
          : undefined,
        properties: createProtocolDto.propertyIds?.length
          ? { create: createProtocolDto.propertyIds.map((propertyId) => ({ propertyId })) }
          : undefined,
      },
      include: {
        parties: { include: { person: true } },
        properties: { include: { property: true } },
        escrevente: { select: { id: true, name: true, email: true } },
      },
    });

    this.logger.log(`Protocol created: ${protocol.numero}`);
    return protocol;
  }

  async findAll(filter: ProtocolFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, serviceType, status, dataInicio, dataFim, escreventeId, sortBy = 'dataAbertura', sortOrder = 'desc' } = filter;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { observacoes: { contains: search, mode: 'insensitive' } },
        {
          parties: {
            some: {
              person: {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { cpf: { contains: search.replace(/[^\d]/g, '') } },
                  { cnpj: { contains: search.replace(/[^\d]/g, '') } },
                ],
              },
            },
          },
        },
      ];
    }

    if (serviceType) where.serviceType = serviceType;
    if (status) where.status = status;
    if (escreventeId) where.escreventeId = escreventeId;

    if (dataInicio || dataFim) {
      where.dataAbertura = {};
      if (dataInicio) where.dataAbertura.gte = new Date(dataInicio);
      if (dataFim) where.dataAbertura.lte = new Date(dataFim);
    }

    const [data, total] = await Promise.all([
      this.prisma.protocol.findMany({
        where,
        include: {
          parties: { include: { person: { select: { id: true, name: true, cpf: true, cnpj: true } } } },
          properties: { include: { property: { select: { id: true, matricula: true, endereco: true, municipio: true } } } },
          escrevente: { select: { id: true, name: true, email: true } },
          _count: { select: { documents: true, siscoafAnalyses: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.protocol.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id },
      include: {
        parties: { include: { person: true } },
        properties: { include: { property: true } },
        escrevente: { select: { id: true, name: true, email: true } },
        documents: { where: { deletedAt: null } },
        siscoafAnalyses: { orderBy: { createdAt: 'desc' } },
        checklists: { include: { items: true } },
      },
    });

    if (!protocol || protocol.deletedAt) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    return protocol;
  }

  async update(id: string, updateProtocolDto: UpdateProtocolDto) {
    const protocol = await this.prisma.protocol.findUnique({ where: { id } });

    if (!protocol || protocol.deletedAt) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    const data: any = { ...updateProtocolDto };

    if (data.status === ProtocolStatus.CONCLUIDO && !protocol.dataConclusao) {
      data.dataConclusao = new Date();
    }

    if (data.status === ProtocolStatus.CANCELADO && protocol.status === ProtocolStatus.CONCLUIDO) {
      throw new ConflictException('Não é possível cancelar um protocolo já concluído');
    }

    delete data.partyIds;
    delete data.propertyIds;

    const protocolUpdate = this.prisma.protocol.update({
      where: { id },
      data,
    });

    const partyOps = updateProtocolDto.partyIds
      ? this.prisma.protocolParty.deleteMany({ where: { protocolId: id } }).then(() =>
          updateProtocolDto.partyIds.length
            ? this.prisma.protocolParty.createMany({
                data: updateProtocolDto.partyIds.map((personId) => ({ protocolId: id, personId })),
              })
            : null,
        )
      : Promise.resolve();

    const propertyOps = updateProtocolDto.propertyIds
      ? this.prisma.protocolProperty.deleteMany({ where: { protocolId: id } }).then(() =>
          updateProtocolDto.propertyIds.length
            ? this.prisma.protocolProperty.createMany({
                data: updateProtocolDto.propertyIds.map((propertyId) => ({ protocolId: id, propertyId })),
              })
            : null,
        )
      : Promise.resolve();

    await Promise.all([protocolUpdate, partyOps, propertyOps]);

    const updated = await this.findOne(id);
    this.logger.log(`Protocol updated: ${updated.numero}`);

    return updated;
  }

  async remove(id: string) {
    const protocol = await this.prisma.protocol.findUnique({ where: { id } });

    if (!protocol || protocol.deletedAt) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    await this.prisma.protocol.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Protocol soft-deleted: ${protocol.numero}`);
    return { message: 'Protocolo removido com sucesso' };
  }

  async updateStatus(id: string, status: ProtocolStatus) {
    const protocol = await this.prisma.protocol.findUnique({ where: { id } });

    if (!protocol || protocol.deletedAt) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    const data: any = { status };

    if (status === ProtocolStatus.CONCLUIDO && !protocol.dataConclusao) {
      data.dataConclusao = new Date();
    }

    if (status === ProtocolStatus.CANCELADO && protocol.status === ProtocolStatus.CONCLUIDO) {
      throw new ConflictException('Não é possível cancelar um protocolo já concluído');
    }

    const updated = await this.prisma.protocol.update({
      where: { id },
      data,
    });

    this.logger.log(`Protocol ${protocol.numero} status updated to ${status}`);
    return updated;
  }

  private async generateProtocolNumber(): Promise<string> {
    const year = new Date().getFullYear().toString();
    const lastProtocol = await this.prisma.protocol.findFirst({
      where: { numero: { startsWith: year } },
      orderBy: { numero: 'desc' },
    });

    let nextSeq = 1;
    if (lastProtocol) {
      const parts = lastProtocol.numero.split('/');
      if (parts.length === 2) {
        nextSeq = parseInt(parts[1]) + 1;
      }
    }

    return `${year}/${nextSeq.toString().padStart(5, '0')}`;
  }
}
