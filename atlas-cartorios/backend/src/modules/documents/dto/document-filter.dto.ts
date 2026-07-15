import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { DocumentType } from '@prisma/client';

export class DocumentFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID do protocolo' })
  @IsOptional()
  @IsUUID('4')
  protocolId?: string;

  @ApiPropertyOptional({ description: 'ID da pessoa' })
  @IsOptional()
  @IsUUID('4')
  personId?: string;

  @ApiPropertyOptional({ enum: DocumentType, description: 'Tipo de documento' })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiPropertyOptional({ description: 'Buscar por nome do arquivo' })
  @IsOptional()
  @IsString()
  search?: string;
}
