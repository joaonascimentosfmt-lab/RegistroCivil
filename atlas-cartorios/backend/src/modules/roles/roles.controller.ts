import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Perfis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar novo perfil' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Perfil já existe' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Listar todos os perfis' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Obter perfil por ID' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar perfil' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover perfil' })
  @ApiResponse({ status: 200, description: 'Perfil removido com sucesso' })
  @ApiResponse({ status: 409, description: 'Perfil possui usuários vinculados' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
