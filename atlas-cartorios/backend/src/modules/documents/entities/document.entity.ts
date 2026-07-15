import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '@prisma/client';

export class DocumentEntity {
  @ApiProperty({ description: 'ID do documento' })
  id: string;

  @ApiPropertyOptional({ description: 'ID do protocolo' })
  protocolId: string | null;

  @ApiPropertyOptional({ description: 'ID da pessoa' })
  personId: string | null;

  @ApiProperty({ enum: DocumentType, description: 'Tipo de documento' })
  type: DocumentType;

  @ApiProperty({ description: 'Nome do arquivo' })
  filename: string;

  @ApiProperty({ description: 'Nome original do arquivo' })
  originalName: string;

  @ApiProperty({ description: 'Tipo MIME' })
  mimeType: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  size: number;

  @ApiProperty({ description: 'Versão do documento' })
  version: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
