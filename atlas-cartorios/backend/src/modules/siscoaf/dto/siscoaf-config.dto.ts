import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertParameterDto {
  @ApiProperty({ description: 'Chave do parâmetro' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Nome do parâmetro' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Valor do parâmetro' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Descrição' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Categoria' })
  @IsOptional()
  @IsString()
  category?: string;
}
