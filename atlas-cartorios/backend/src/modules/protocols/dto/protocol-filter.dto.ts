import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ProtocolStatus, ServiceType } from '@prisma/client';

export class ProtocolFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Buscar por número, nome de parte, CPF' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ServiceType, description: 'Filtrar por tipo de serviço' })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @ApiPropertyOptional({ enum: ProtocolStatus, description: 'Filtrar por status' })
  @IsOptional()
  @IsEnum(ProtocolStatus)
  status?: ProtocolStatus;

  @ApiPropertyOptional({ description: 'Data inicial (abertura)' })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Data final (abertura)' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'ID do escrevente' })
  @IsOptional()
  @IsString()
  escreventeId?: string;
}
