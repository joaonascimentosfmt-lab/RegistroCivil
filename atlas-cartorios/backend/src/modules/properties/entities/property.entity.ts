import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PropertyEntity {
  @ApiProperty({ description: 'ID do imóvel' })
  id: string;

  @ApiProperty({ description: 'Matrícula' })
  matricula: string;

  @ApiProperty({ description: 'Livro' })
  livro: string;

  @ApiProperty({ description: 'Folha' })
  folha: string;

  @ApiProperty({ description: 'Endereço' })
  endereco: string;

  @ApiProperty({ description: 'Município' })
  municipio: string;

  @ApiPropertyOptional({ description: 'Área' })
  area: string | null;

  @ApiPropertyOptional({ description: 'Inscrição Municipal' })
  inscricaoMunicipal: string | null;

  @ApiPropertyOptional({ description: 'CCIR' })
  ccir: string | null;

  @ApiPropertyOptional({ description: 'ITR' })
  itr: string | null;

  @ApiPropertyOptional({ description: 'CAR' })
  car: string | null;

  @ApiPropertyOptional({ description: 'Confrontações' })
  confrontacoes: string | null;

  @ApiPropertyOptional({ description: 'Observações' })
  observacoes: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
