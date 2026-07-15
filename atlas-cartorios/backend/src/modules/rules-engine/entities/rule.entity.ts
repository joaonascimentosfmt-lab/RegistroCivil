import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RuleEntity {
  @ApiProperty({ description: 'ID da regra' })
  id: string;

  @ApiProperty({ description: 'Nome da regra' })
  name: string;

  @ApiPropertyOptional({ description: 'Descrição da regra' })
  description: string | null;

  @ApiProperty({ description: 'Condições da regra (JSON)' })
  conditions: any;

  @ApiProperty({ description: 'Ações da regra (JSON)' })
  actions: any;

  @ApiProperty({ description: 'Regra ativa' })
  active: boolean;

  @ApiProperty({ description: 'Prioridade da regra' })
  priority: number;

  @ApiPropertyOptional({ description: 'Categoria da regra' })
  category: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
