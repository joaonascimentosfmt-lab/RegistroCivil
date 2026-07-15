import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Criar checklist para um protocolo' })
  @ApiResponse({ status: 201, description: 'Checklist criado com sucesso' })
  async create(@Body() createChecklistDto: CreateChecklistDto) {
    return this.checklistService.create(createChecklistDto);
  }

  @Get('protocol/:protocolId')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter checklist por protocolo' })
  @ApiResponse({ status: 404, description: 'Checklist não encontrado' })
  async findByProtocol(@Param('protocolId') protocolId: string) {
    return this.checklistService.findByProtocol(protocolId);
  }

  @Get('protocol/:protocolId/progress')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter progresso do checklist' })
  async getProgress(@Param('protocolId') protocolId: string) {
    return this.checklistService.getProgress(protocolId);
  }

  @Patch('items/:itemId')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Atualizar status de um item do checklist' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async updateItem(@Param('itemId') itemId: string, @Body() updateDto: UpdateChecklistItemDto) {
    return this.checklistService.updateItem(itemId, updateDto);
  }
}
