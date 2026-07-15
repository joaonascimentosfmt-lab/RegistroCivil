import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalysisDto {
  @ApiProperty({ description: 'ID do protocolo' })
  @IsUUID('4', { message: 'ID do protocolo inválido' })
  protocolId: string;

  @ApiPropertyOptional({ description: 'Justificativa' })
  @IsOptional()
  @IsString()
  justification?: string;

  @ApiPropertyOptional({ description: 'Recomendação' })
  @IsOptional()
  @IsString()
  recommendation?: string;
}
