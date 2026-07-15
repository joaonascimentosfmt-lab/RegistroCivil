import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity {
  @ApiProperty({ description: 'ID do perfil' })
  id: string;

  @ApiProperty({ description: 'Nome do perfil' })
  name: string;

  @ApiProperty({ description: 'Descrição do perfil', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Permissões do perfil' })
  permissions: string[];

  @ApiProperty({ description: 'Perfil do sistema' })
  isSystem: boolean;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}
