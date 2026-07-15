import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nome completo do usuário' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name?: string;

  @ApiPropertyOptional({ description: 'Email do usuário' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Nova senha' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({ description: 'ID do perfil' })
  @IsOptional()
  @IsUUID('4', { message: 'ID do perfil inválido' })
  roleId?: string;

  @ApiPropertyOptional({ description: 'Usuário ativo' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Serventia' })
  @IsOptional()
  @IsString()
  serventia?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
