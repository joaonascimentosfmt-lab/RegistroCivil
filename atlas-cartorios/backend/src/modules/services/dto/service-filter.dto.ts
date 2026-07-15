import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ServiceType } from '@prisma/client';

export class ServiceFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ServiceType, description: 'Filtrar por tipo de serviço' })
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;
}
