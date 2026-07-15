import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: '12345', description: 'Matrícula do imóvel' })
  @IsString()
  @MinLength(1, { message: 'Matrícula é obrigatória' })
  matricula: string;

  @ApiProperty({ example: '2', description: 'Livro' })
  @IsString()
  livro: string;

  @ApiProperty({ example: '150', description: 'Folha' })
  @IsString()
  folha: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço do imóvel' })
  @IsString()
  @MinLength(5, { message: 'Endereço deve ter no mínimo 5 caracteres' })
  endereco: string;

  @ApiProperty({ example: 'São Paulo', description: 'Município' })
  @IsString()
  municipio: string;

  @ApiPropertyOptional({ example: '350 m²', description: 'Área' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ description: 'Inscrição Municipal' })
  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({ description: 'CCIR' })
  @IsOptional()
  @IsString()
  ccir?: string;

  @ApiPropertyOptional({ description: 'ITR' })
  @IsOptional()
  @IsString()
  itr?: string;

  @ApiPropertyOptional({ description: 'CAR' })
  @IsOptional()
  @IsString()
  car?: string;

  @ApiPropertyOptional({ description: 'Confrontações' })
  @IsOptional()
  @IsString()
  confrontacoes?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
