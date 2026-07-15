import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SiscoafParameterEntity {
  @ApiProperty({ description: 'ID do parâmetro' })
  id: string;

  @ApiProperty({ description: 'Chave do parâmetro' })
  key: string;

  @ApiProperty({ description: 'Nome do parâmetro' })
  name: string;

  @ApiProperty({ description: 'Valor do parâmetro' })
  value: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  description: string | null;

  @ApiPropertyOptional({ description: 'Categoria' })
  category: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
