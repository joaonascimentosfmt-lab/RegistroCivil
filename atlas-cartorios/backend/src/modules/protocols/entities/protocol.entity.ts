import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProtocolStatus, ServiceType } from '@prisma/client';

export class ProtocolEntity {
  @ApiProperty({ description: 'ID do protocolo' })
  id: string;

  @ApiProperty({ description: 'Número do protocolo' })
  numero: string;

  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  serviceType: ServiceType;

  @ApiProperty({ enum: ProtocolStatus, description: 'Status do protocolo' })
  status: ProtocolStatus;

  @ApiPropertyOptional({ description: 'Valor' })
  valor: number | null;

  @ApiProperty({ description: 'Data de abertura' })
  dataAbertura: Date;

  @ApiPropertyOptional({ description: 'Data de conclusão' })
  dataConclusao: Date | null;

  @ApiPropertyOptional({ description: 'ID do escrevente' })
  escreventeId: string | null;

  @ApiPropertyOptional({ description: 'Observações' })
  observacoes: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
