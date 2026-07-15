import { IsString, IsOptional, IsEnum, IsDateString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '@prisma/client';

export class UpdatePersonDto {
  @ApiPropertyOptional({ enum: PersonType, description: 'Tipo: PF ou PJ' })
  @IsOptional()
  @IsEnum(PersonType)
  type?: PersonType;

  @ApiPropertyOptional({ description: 'Nome completo ou razão social' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'CPF' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({ description: 'CNPJ' })
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

  @ApiPropertyOptional({ description: 'Telefone' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ description: 'Email' })
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
