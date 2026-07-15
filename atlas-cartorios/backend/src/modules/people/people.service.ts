import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonFilterDto } from './dto/person-filter.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { CpfCnpjUtils } from '../../common/utils/cpf-cnpj.utils';

@Injectable()
export class PeopleService {
  private readonly logger = new Logger(PeopleService.name);

  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    if (createPersonDto.cpf) {
      const cleanCPF = createPersonDto.cpf.replace(/[^\d]/g, '');
      if (!CpfCnpjUtils.isValidCPF(cleanCPF)) {
        throw new ConflictException('CPF inválido');
      }
      const existing = await this.prisma.person.findUnique({ where: { cpf: cleanCPF } });
      if (existing) {
        throw new ConflictException('CPF já cadastrado');
      }
      createPersonDto.cpf = cleanCPF;
    }

    if (createPersonDto.cnpj) {
      const cleanCNPJ = createPersonDto.cnpj.replace(/[^\d]/g, '');
      if (!CpfCnpjUtils.isValidCNPJ(cleanCNPJ)) {
        throw new ConflictException('CNPJ inválido');
      }
      const existing = await this.prisma.person.findUnique({ where: { cnpj: cleanCNPJ } });
      if (existing) {
        throw new ConflictException('CNPJ já cadastrado');
      }
      createPersonDto.cnpj = cleanCNPJ;
    }

    const person = await this.prisma.person.create({
      data: {
        ...createPersonDto,
        dataNascimento: createPersonDto.dataNascimento ? new Date(createPersonDto.dataNascimento) : undefined,
      } as any,
    });

    this.logger.log(`Person created: ${person.name}`);
    return person;
  }

  async findAll(filter: PersonFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, type, sortBy = 'createdAt', sortOrder = 'desc' } = filter;

    const where: any = { deletedAt: null };

    if (search) {
      const cleanSearch = search.replace(/[^\d]/g, '');
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { rg: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search, mode: 'insensitive' } },
      ];
      if (cleanSearch.length >= 3) {
        where.OR.push(
          { cpf: { contains: cleanSearch } },
          { cnpj: { contains: cleanSearch } },
        );
      }
    }

    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.person.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.person.count({ where }),
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
    const person = await this.prisma.person.findUnique({ where: { id } });

    if (!person || person.deletedAt) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return person;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({ where: { id } });

    if (!person || person.deletedAt) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (updatePersonDto.cpf) {
      const cleanCPF = updatePersonDto.cpf.replace(/[^\d]/g, '');
      if (!CpfCnpjUtils.isValidCPF(cleanCPF)) {
        throw new ConflictException('CPF inválido');
      }
      if (cleanCPF !== person.cpf) {
        const existing = await this.prisma.person.findUnique({ where: { cpf: cleanCPF } });
        if (existing) {
          throw new ConflictException('CPF já cadastrado');
        }
      }
      updatePersonDto.cpf = cleanCPF;
    }

    if (updatePersonDto.cnpj) {
      const cleanCNPJ = updatePersonDto.cnpj.replace(/[^\d]/g, '');
      if (!CpfCnpjUtils.isValidCNPJ(cleanCNPJ)) {
        throw new ConflictException('CNPJ inválido');
      }
      if (cleanCNPJ !== person.cnpj) {
        const existing = await this.prisma.person.findUnique({ where: { cnpj: cleanCNPJ } });
        if (existing) {
          throw new ConflictException('CNPJ já cadastrado');
        }
      }
      updatePersonDto.cnpj = cleanCNPJ;
    }

    const data: any = { ...updatePersonDto };
    if (data.dataNascimento) data.dataNascimento = new Date(data.dataNascimento);

    const updated = await this.prisma.person.update({
      where: { id },
      data,
    });

    this.logger.log(`Person updated: ${updated.name}`);
    return updated;
  }

  async remove(id: string) {
    const person = await this.prisma.person.findUnique({ where: { id } });

    if (!person || person.deletedAt) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    await this.prisma.person.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Person soft-deleted: ${person.name}`);
    return { message: 'Pessoa removida com sucesso' };
  }
}
