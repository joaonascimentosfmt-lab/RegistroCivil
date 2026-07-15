import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'ID do perfil' })
  roleId: string;

  @ApiProperty({ description: 'Perfil do usuário' })
  role?: {
    id: string;
    name: string;
    description: string | null;
    permissions: string[];
  };

  @ApiProperty({ description: 'Usuário ativo' })
  isActive: boolean;

  @ApiProperty({ description: 'Serventia' })
  serventia: string;

  @ApiProperty({ description: 'Avatar URL' })
  avatar: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
