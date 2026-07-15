import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DecisionTreeService } from './decision-tree.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { EvaluateTreeDto } from './dto/evaluate-tree.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Árvore de Decisão')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('decision-tree')
export class DecisionTreeController {
  constructor(private readonly decisionTreeService: DecisionTreeService) {}

  @Post()
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Criar nova árvore de decisão' })
  @ApiResponse({ status: 201, description: 'Árvore criada com sucesso' })
  async create(@Body() createTreeDto: CreateTreeDto) {
    return this.decisionTreeService.create(createTreeDto);
  }

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Listar árvores de decisão' })
  async findAll(@Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.decisionTreeService.findAll(isActive);
  }

  @Get(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter árvore por ID' })
  @ApiResponse({ status: 404, description: 'Árvore não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.decisionTreeService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Atualizar árvore de decisão' })
  @ApiResponse({ status: 404, description: 'Árvore não encontrada' })
  async update(@Param('id') id: string, @Body() updateTreeDto: UpdateTreeDto) {
    return this.decisionTreeService.update(id, updateTreeDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover árvore de decisão' })
  @ApiResponse({ status: 200, description: 'Árvore removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Árvore não encontrada' })
  async remove(@Param('id') id: string) {
    return this.decisionTreeService.remove(id);
  }

  @Post('evaluate')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:analyze')
  @ApiOperation({ summary: 'Avaliar árvore de decisão' })
  async evaluate(@Body() evaluateTreeDto: EvaluateTreeDto) {
    return this.decisionTreeService.evaluate(evaluateTreeDto.treeId, evaluateTreeDto.answers);
  }
}
