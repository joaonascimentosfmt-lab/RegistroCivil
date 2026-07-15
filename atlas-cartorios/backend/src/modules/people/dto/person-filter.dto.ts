import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PersonType } from '@prisma/client';

export class PersonFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Buscar por nome, CPF, CNPJ, RG, email ou telefone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PersonType, description: 'Filtrar por tipo' })
  @IsOptional()
  @IsEnum(PersonType)
  type?: PersonType;
}
