import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DecisionTreeEntity {
  @ApiProperty({ description: 'ID da árvore' })
  id: string;

  @ApiProperty({ description: 'Nome da árvore' })
  name: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  description: string | null;

  @ApiProperty({ description: 'Nós da árvore (JSON)' })
  nodes: any;

  @ApiProperty({ description: 'Árvore ativa' })
  active: boolean;

  @ApiProperty({ description: 'Versão' })
  version: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class TreeNodeEntity {
  id: string;
  question: string;
  answers: { label: string; nextNodeId: string }[];
  isLeaf: boolean;
  result: string | null;
}
