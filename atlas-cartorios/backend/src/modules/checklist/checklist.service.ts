import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { SERVICE_CHECKLIST_CONFIG } from '../services/config/service-checklist.config';

@Injectable()
export class ChecklistService {
  private readonly logger = new Logger(ChecklistService.name);

  constructor(private prisma: PrismaService) {}

  async create(createChecklistDto: CreateChecklistDto) {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id: createChecklistDto.protocolId },
    });

    if (!protocol || protocol.deletedAt) {
      throw new NotFoundException('Protocolo não encontrado');
    }

    const existingChecklist = await this.prisma.checklist.findFirst({
      where: { protocolId: createChecklistDto.protocolId },
    });

    if (existingChecklist) {
      throw new NotFoundException('Checklist já existe para este protocolo');
    }

    const requiredDocs = SERVICE_CHECKLIST_CONFIG[createChecklistDto.serviceType] || [];
    const docLabels: Record<string, string> = {
      RG: 'RG (Documento de Identidade)',
      CPF: 'CPF (Cadastro de Pessoa Física)',
      CERTIDAO_CASAMENTO: 'Certidão de Casamento',
      MATRICULA: 'Matrícula do Imóvel',
      ITBI: 'ITBI',
      CCIR: 'CCIR',
      ITR: 'ITR',
      CAR: 'CAR',
      COMPROVANTE_ENDERECO: 'Comprovante de Endereço',
      PROCURACAO: 'Procuração',
      OUTROS: 'Outros Documentos',
    };

    const items = requiredDocs.map((docType) => ({
      documentType: docType,
      label: docLabels[docType] || docType,
      required: true,
      status: 'PENDING' as const,
    }));

    const checklist = await this.prisma.checklist.create({
      data: {
        protocolId: createChecklistDto.protocolId,
        serviceType: createChecklistDto.serviceType,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    this.logger.log(`Checklist created for protocol ${protocol.numero}`);
    return checklist;
  }

  async findByProtocol(protocolId: string) {
    const checklist = await this.prisma.checklist.findFirst({
      where: { protocolId },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    });

    if (!checklist) {
      throw new NotFoundException('Checklist não encontrado para este protocolo');
    }

    return checklist;
  }

  async updateItem(itemId: string, updateDto: UpdateChecklistItemDto) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Item do checklist não encontrado');
    }

    const updated = await this.prisma.checklistItem.update({
      where: { id: itemId },
      data: updateDto,
    });

    return updated;
  }

  async getProgress(protocolId: string) {
    const checklist = await this.prisma.checklist.findFirst({
      where: { protocolId },
      include: { items: true },
    });

    if (!checklist) {
      throw new NotFoundException('Checklist não encontrado');
    }

    const total = checklist.items.length;
    const completed = checklist.items.filter((i) => i.status === 'COMPLETED').length;
    const notApplicable = checklist.items.filter((i) => i.status === 'NOT_APPLICABLE').length;
    const pending = total - completed - notApplicable;

    return {
      checklistId: checklist.id,
      protocolId,
      total,
      completed,
      notApplicable,
      pending,
      progress: total > 0 ? Math.round(((completed + notApplicable) / total) * 100) : 100,
    };
  }
}
