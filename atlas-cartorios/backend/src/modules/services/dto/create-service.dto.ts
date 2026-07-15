import { IsString, IsOptional, IsEnum, IsArray, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({ description: 'Nome do serviço' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição do serviço' })
  @IsString()
  description: string;

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
