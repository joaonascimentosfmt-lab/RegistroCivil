import { IsString, IsOptional, IsBoolean, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnswerDto {
  @IsString()
  label: string;

  @IsString()
  nextNodeId: string;
}

export class TreeNodeDto {
  @IsString()
  id: string;

  @IsString()
  question: string;

  @IsOptional()
  @IsArray()
  answers?: AnswerDto[];

  @IsOptional()
  @IsBoolean()
  isLeaf?: boolean;

  @IsOptional()
  @IsString()
  result?: string;
}

export class CreateTreeDto {
  @ApiProperty({ description: 'Nome da árvore de decisão' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nós da árvore' })
  @IsArray()
  nodes: TreeNodeDto[];

  @ApiPropertyOptional({ default: true, description: 'Árvore ativa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
