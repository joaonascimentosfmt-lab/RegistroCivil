import { IsString, IsOptional, IsEnum, MinLength, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '@prisma/client';

export class CreatePersonDto {
  @ApiProperty({ enum: PersonType, description: 'Tipo: PF ou PJ' })
  @IsEnum(PersonType, { message: 'Tipo deve ser PF ou PJ' })
  type: PersonType;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo ou razão social' })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @ApiPropertyOptional({ example: '123.456.789-00', description: 'CPF' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-00', description: 'CNPJ' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({ description: 'RG' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({ description: 'CNH' })
  @IsOptional()
  @IsString()
  cnh?: string;

  @ApiPropertyOptional({ description: 'Estado civil' })
  @IsOptional()
  @IsString()
  estadoCivil?: string;

  @ApiPropertyOptional({ description: 'Profissão' })
  @IsOptional()
  @IsString()
  profissao?: string;

  @ApiPropertyOptional({ description: 'Nacionalidade' })
  @IsOptional()
  @IsString()
  nacionalidade?: string;

  @ApiPropertyOptional({ description: 'Data de nascimento' })
  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999', description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ example: 'joao@email.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'CEP' })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiPropertyOptional({ description: 'Endereço' })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ description: 'Estado' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
