import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePropertyDto {
  @ApiPropertyOptional({ description: 'Matrícula do imóvel' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  matricula?: string;

  @ApiPropertyOptional({ description: 'Livro' })
  @IsOptional()
  @IsString()
  livro?: string;

  @ApiPropertyOptional({ description: 'Folha' })
  @IsOptional()
  @IsString()
  folha?: string;

  @ApiPropertyOptional({ description: 'Endereço do imóvel' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  endereco?: string;

  @ApiPropertyOptional({ description: 'Município' })
  @IsOptional()
  @IsString()
  municipio?: string;

  @ApiPropertyOptional({ description: 'Área' })
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
