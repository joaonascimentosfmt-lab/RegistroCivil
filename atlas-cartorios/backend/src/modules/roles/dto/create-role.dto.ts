import { IsString, MinLength, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'escrevente', description: 'Nome do perfil' })
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  @ApiPropertyOptional({ description: 'Descrição do perfil' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Lista de permissões' })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiPropertyOptional({ default: false, description: 'Perfil do sistema' })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
