import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RiskLevel } from '@prisma/client';

export class SiscoafAnalysisEntity {
  @ApiProperty({ description: 'ID da análise' })
  id: string;

  @ApiProperty({ description: 'ID do protocolo' })
  protocolId: string;

  @ApiProperty({ description: 'Pontuação total' })
  score: number;

  @ApiProperty({ enum: RiskLevel, description: 'Nível de risco' })
  riskLevel: RiskLevel;

  @ApiProperty({ description: 'Indicadores avaliados' })
  indicators: any;

  @ApiPropertyOptional({ description: 'Justificativa' })
  justification: string | null;

  @ApiPropertyOptional({ description: 'Recomendação' })
  recommendation: string | null;

  @ApiPropertyOptional({ description: 'Decisão' })
  decision: string | null;

  @ApiPropertyOptional({ description: 'ID do analista' })
  analyzedById: string | null;

  @ApiPropertyOptional({ description: 'Data da análise' })
  analyzedAt: Date | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
