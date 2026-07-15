import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SiscoafIndicatorEntity {
  @ApiProperty({ description: 'ID do indicador' })
  id: string;

  @ApiProperty({ description: 'Descrição do indicador' })
  description: string;

  @ApiProperty({ description: 'Peso do indicador (1-100)' })
  weight: number;

  @ApiProperty({ description: 'Categoria do indicador' })
  category: string;

  @ApiProperty({ description: 'Indicador obrigatório' })
  isRequired: boolean;

  @ApiProperty({ description: 'Indicador opcional' })
  isOptional: boolean;

  @ApiPropertyOptional({ description: 'Referência normativa' })
  normativeReference: string | null;

  @ApiProperty({ description: 'Indicador ativo' })
  active: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
