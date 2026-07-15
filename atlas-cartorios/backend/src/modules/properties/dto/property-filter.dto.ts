import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PropertyFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Buscar por matrícula, endereço, município' })
  @IsOptional()
  @IsString()
  search?: string;
}
