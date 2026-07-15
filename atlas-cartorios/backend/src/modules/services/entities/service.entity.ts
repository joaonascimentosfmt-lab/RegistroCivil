import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class ServiceEntity {
  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  type: ServiceType;

  @ApiProperty({ description: 'Nome do serviço' })
  name: string;

  @ApiProperty({ description: 'Descrição do serviço' })
  description: string;

  @ApiPropertyOptional({ description: 'Documentos obrigatórios' })
  requiredDocuments: string[];

  @ApiPropertyOptional({ description: 'Passos do workflow' })
  workflowSteps: string[];

  @ApiPropertyOptional({ description: 'Base legal' })
  legalBasis: string | null;

  @ApiPropertyOptional({ description: 'Valor sugerido' })
  suggestedValue: number | null;
}
