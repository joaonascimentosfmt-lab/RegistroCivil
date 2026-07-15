import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonType } from '@prisma/client';

export class PersonEntity {
  @ApiProperty({ description: 'ID da pessoa' })
  id: string;

  @ApiProperty({ enum: PersonType, description: 'Tipo: PF (Pessoa Física) ou PJ (Pessoa Jurídica)' })
  type: PersonType;

  @ApiProperty({ description: 'Nome completo ou razão social' })
  name: string;

  @ApiPropertyOptional({ description: 'CPF' })
  cpf: string | null;

  @ApiPropertyOptional({ description: 'CNPJ' })
  cnpj: string | null;

  @ApiPropertyOptional({ description: 'RG' })
  rg: string | null;

  @ApiPropertyOptional({ description: 'CNH' })
  cnh: string | null;

  @ApiPropertyOptional({ description: 'Estado civil' })
  estadoCivil: string | null;

  @ApiPropertyOptional({ description: 'Profissão' })
  profissao: string | null;

  @ApiPropertyOptional({ description: 'Nacionalidade' })
  nacionalidade: string | null;

  @ApiPropertyOptional({ description: 'Data de nascimento' })
  dataNascimento: Date | null;

  @ApiPropertyOptional({ description: 'Telefone' })
  telefone: string | null;

  @ApiPropertyOptional({ description: 'Email' })
  email: string | null;

  @ApiPropertyOptional({ description: 'CEP' })
  cep: string | null;

  @ApiPropertyOptional({ description: 'Endereço' })
  endereco: string | null;

  @ApiPropertyOptional({ description: 'Cidade' })
  cidade: string | null;

  @ApiPropertyOptional({ description: 'Estado' })
  estado: string | null;

  @ApiPropertyOptional({ description: 'Observações' })
  observacoes: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
