import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChecklistItemStatus } from '@prisma/client';

export class UpdateChecklistItemDto {
  @ApiProperty({ enum: ChecklistItemStatus, description: 'Novo status do item' })
  @IsEnum(ChecklistItemStatus, { message: 'Status inválido' })
  status: ChecklistItemStatus;

  @ApiPropertyOptional({ description: 'Observações sobre o item' })
  @IsOptional()
  @IsString()
  notes?: string;
}
