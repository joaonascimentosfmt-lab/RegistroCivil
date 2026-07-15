import { IsString, IsOptional, IsEnum, IsArray, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';

export class CreateProtocolDto {
  @ApiProperty({ enum: ServiceType, description: 'Tipo de serviço' })
  @IsEnum(ServiceType, { message: 'Tipo de serviço inválido' })
  serviceType: ServiceType;

  @ApiPropertyOptional({ description: 'ID do escrevente responsável' })
  @IsOptional()
  @IsUUID('4')
  escreventeId?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ description: 'Valor do serviço' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiPropertyOptional({ description: 'IDs das partes envolvidas' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  partyIds?: string[];

  @ApiPropertyOptional({ description: 'IDs dos imóveis' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  propertyIds?: string[];
}
