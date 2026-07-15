import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIndicatorDto {
  @ApiPropertyOptional({ description: 'Descrição do indicador' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Peso do indicador (1-100)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  weight?: number;

  @ApiPropertyOptional({ description: 'Categoria do indicador' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Indicador obrigatório' })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Indicador opcional' })
  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @ApiPropertyOptional({ description: 'Referência normativa' })
  @IsOptional()
  @IsString()
  normativeReference?: string;

  @ApiPropertyOptional({ description: 'Indicador ativo' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
