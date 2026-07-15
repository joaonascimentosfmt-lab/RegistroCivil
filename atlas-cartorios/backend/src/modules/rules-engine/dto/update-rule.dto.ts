import { IsString, IsOptional, IsBoolean, IsNumber, Min, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRuleDto {
  @ApiPropertyOptional({ description: 'Nome da regra' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição da regra' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Condições da regra (JSON)' })
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Ações da regra (JSON)' })
  @IsOptional()
  @IsObject()
  actions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Regra ativa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Prioridade' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({ description: 'Categoria da regra' })
  @IsOptional()
  @IsString()
  category?: string;
}
