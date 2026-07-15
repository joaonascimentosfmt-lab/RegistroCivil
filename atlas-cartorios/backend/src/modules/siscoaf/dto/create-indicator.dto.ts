import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIndicatorDto {
  @ApiProperty({ description: 'Descrição do indicador' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Peso do indicador (1-100)' })
  @IsNumber()
  @Min(1)
  @Max(100)
  weight: number;

  @ApiProperty({ description: 'Categoria do indicador' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ default: false, description: 'Indicador obrigatório' })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ default: true, description: 'Indicador opcional' })
  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @ApiPropertyOptional({ description: 'Referência normativa' })
  @IsOptional()
  @IsString()
  normativeReference?: string;

  @ApiPropertyOptional({ default: true, description: 'Indicador ativo' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
