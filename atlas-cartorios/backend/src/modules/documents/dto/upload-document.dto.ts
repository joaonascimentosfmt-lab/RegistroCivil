import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class UploadDocumentDto {
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
}
