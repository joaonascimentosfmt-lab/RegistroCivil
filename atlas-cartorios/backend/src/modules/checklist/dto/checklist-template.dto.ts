import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChecklistTemplateItemDto {
  @ApiProperty({ description: 'Tipo de documento' })
  @IsString()
  documentType: string;

  @ApiProperty({ description: 'Label do item' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ default: true, description: 'Item obrigatório' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}

export class ChecklistTemplateDto {
  @ApiProperty({ description: 'Nome do template' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Itens do template' })
  @IsArray()
  items: ChecklistTemplateItemDto[];
}
