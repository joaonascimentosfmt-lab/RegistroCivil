import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TreeNodeDto } from './create-tree.dto';

export class UpdateTreeDto {
  @ApiPropertyOptional({ description: 'Nome da árvore' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Nós da árvore' })
  @IsOptional()
  @IsArray()
  nodes?: TreeNodeDto[];

  @ApiPropertyOptional({ description: 'Árvore ativa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
