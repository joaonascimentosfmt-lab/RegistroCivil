import { IsString, IsOptional, IsBoolean, IsNumber, Min, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRuleDto {
  @ApiProperty({ example: 'Alta movimentação financeira', description: 'Nome da regra' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descrição da regra' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Condições da regra (JSON object)' })
  @IsObject()
  conditions: Record<string, any>;

  @ApiProperty({ description: 'Ações da regra (JSON object)' })
  @IsObject()
  actions: Record<string, any>;

  @ApiPropertyOptional({ default: true, description: 'Regra ativa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ default: 0, description: 'Prioridade (maior = mais prioritário)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({ description: 'Categoria da regra' })
  @IsOptional()
  @IsString()
  category?: string;
}
