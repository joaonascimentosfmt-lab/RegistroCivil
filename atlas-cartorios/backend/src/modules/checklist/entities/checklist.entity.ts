import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, ChecklistItemStatus } from '@prisma/client';

export class ChecklistItemEntity {
  @ApiProperty({ description: 'ID do item' })
  id: string;

  @ApiProperty({ description: 'ID do checklist' })
  checklistId: string;

  @ApiProperty({ description: 'Tipo de documento' })
  documentType: string;

  @ApiProperty({ description: 'Label do item' })
  label: string;

  @ApiProperty({ description: 'Item obrigatório' })
  required: boolean;

  @ApiProperty({ enum: ChecklistItemStatus, description: 'Status do item' })
  status: ChecklistItemStatus;

  @ApiPropertyOptional({ description: 'Observações' })
  notes: string | null;
}

export class ChecklistEntity {
  @ApiProperty({ description: 'ID do checklist' })
  id: string;

  @ApiProperty({ description: 'ID do protocolo' })
  protocolId: string;

  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  serviceType: ServiceType;

  @ApiProperty({ description: 'Itens do checklist' })
  items: ChecklistItemEntity[];

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
