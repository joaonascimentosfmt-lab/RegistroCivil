import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RulesEngineService } from './rules-engine.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { EvaluateRuleDto } from './dto/evaluate-rule.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Rules Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rules-engine')
export class RulesEngineController {
  constructor(private readonly rulesEngineService: RulesEngineService) {}

  @Post('rules')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Criar nova regra' })
  @ApiResponse({ status: 201, description: 'Regra criada com sucesso' })
  async createRule(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesEngineService.create(createRuleDto);
  }

  @Get('rules')
  @Roles('admin', 'tabeliao', 'substituto')
  @ApiOperation({ summary: 'Listar regras' })
  async findAllRules(@Query('category') category?: string) {
    return this.rulesEngineService.findAll(category);
  }

  @Get('rules/:id')
  @Roles('admin', 'tabeliao', 'substituto')
  @ApiOperation({ summary: 'Obter regra por ID' })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  async findOneRule(@Param('id') id: string) {
    return this.rulesEngineService.findOne(id);
  }

  @Put('rules/:id')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Atualizar regra' })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  async updateRule(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesEngineService.update(id, updateRuleDto);
  }

  @Delete('rules/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover regra' })
  @ApiResponse({ status: 200, description: 'Regra removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Regra não encontrada' })
  async removeRule(@Param('id') id: string) {
    return this.rulesEngineService.remove(id);
  }

  @Post('evaluate')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Avaliar regras com um contexto' })
  async evaluate(@Body() evaluateRuleDto: EvaluateRuleDto, @Query('category') category?: string) {
    return this.rulesEngineService.evaluate(evaluateRuleDto.context, category);
  }

  @Post('rules/:id/evaluate')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Avaliar uma regra específica' })
  async evaluateById(@Param('id') id: string, @Body() evaluateRuleDto: EvaluateRuleDto) {
    return this.rulesEngineService.evaluateById(id, evaluateRuleDto.context);
  }

  @Post('rules/:id/toggle')
  @Roles('admin')
  @ApiOperation({ summary: 'Ativar/desativar regra' })
  async toggleActive(@Param('id') id: string) {
    return this.rulesEngineService.toggleActive(id);
  }
}
