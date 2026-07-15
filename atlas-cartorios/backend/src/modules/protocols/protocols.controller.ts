import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { ProtocolFilterDto } from './dto/protocol-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProtocolStatus } from '@prisma/client';

@ApiTags('Protocolos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Post()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @ApiOperation({ summary: 'Criar novo protocolo' })
  @ApiResponse({ status: 201, description: 'Protocolo criado com sucesso' })
  async create(@Body() createProtocolDto: CreateProtocolDto) {
    return this.protocolsService.create(createProtocolDto);
  }

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao', 'financeiro', 'consulta')
  @ApiOperation({ summary: 'Listar protocolos' })
  async findAll(@Query() filter: ProtocolFilterDto) {
    return this.protocolsService.findAll(filter);
  }

  @Get(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao', 'financeiro', 'consulta')
  @ApiOperation({ summary: 'Obter protocolo por ID' })
  @ApiResponse({ status: 404, description: 'Protocolo não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.protocolsService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Atualizar protocolo' })
  @ApiResponse({ status: 404, description: 'Protocolo não encontrado' })
  async update(@Param('id') id: string, @Body() updateProtocolDto: UpdateProtocolDto) {
    return this.protocolsService.update(id, updateProtocolDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover protocolo (soft delete)' })
  @ApiResponse({ status: 200, description: 'Protocolo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Protocolo não encontrado' })
  async remove(@Param('id') id: string) {
    return this.protocolsService.remove(id);
  }

  @Put(':id/status/:status')
  @Roles('admin', 'tabeliao', 'substituto')
  @ApiOperation({ summary: 'Atualizar status do protocolo' })
  @ApiResponse({ status: 404, description: 'Protocolo não encontrado' })
  async updateStatus(@Param('id') id: string, @Param('status') status: ProtocolStatus) {
    return this.protocolsService.updateStatus(id, status);
  }
}
