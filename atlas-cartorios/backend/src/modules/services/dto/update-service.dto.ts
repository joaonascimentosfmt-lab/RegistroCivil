import { IsString, IsOptional, IsArray, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Nome do serviço' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição do serviço' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Documentos obrigatórios' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredDocuments?: string[];

  @ApiPropertyOptional({ description: 'Passos do workflow' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workflowSteps?: string[];

  @ApiPropertyOptional({ description: 'Base legal' })
  @IsOptional()
  @IsString()
  legalBasis?: string;

  @ApiPropertyOptional({ description: 'Valor sugerido' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  suggestedValue?: number;
}
