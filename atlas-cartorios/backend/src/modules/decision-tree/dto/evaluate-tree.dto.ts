import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EvaluateTreeDto {
  @ApiProperty({ description: 'ID da árvore' })
  @IsString()
  treeId: string;

  @ApiProperty({ description: 'Respostas selecionadas (IDs dos nós)' })
  @IsArray()
  @IsString({ each: true })
  answers: string[];
}
