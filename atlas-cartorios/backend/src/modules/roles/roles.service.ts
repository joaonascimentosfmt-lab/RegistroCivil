import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existing) {
      throw new ConflictException('Perfil já existe');
    }

    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        permissions: createRoleDto.permissions,
        isSystem: createRoleDto.isSystem ?? false,
      },
    });

    this.logger.log(`Role created: ${role.name}`);
    return role;
  }

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });
      if (existing) {
        throw new ConflictException('Nome de perfil já existe');
      }
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });

    this.logger.log(`Role updated: ${updated.name}`);
    return updated;
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (role.isSystem) {
      throw new ConflictException('Não é possível remover perfis do sistema');
    }

    const userCount = await this.prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new ConflictException(`Perfil possui ${userCount} usuário(s) vinculado(s). Remova ou altere os usuários primeiro`);
    }

    await this.prisma.role.delete({ where: { id } });

    this.logger.log(`Role deleted: ${role.name}`);
    return { message: 'Perfil removido com sucesso' };
  }
}
