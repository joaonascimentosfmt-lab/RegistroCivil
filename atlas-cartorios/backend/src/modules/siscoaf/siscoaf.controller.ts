import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SiscoafService } from './siscoaf.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpsertParameterDto } from './dto/siscoaf-config.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('SISCOAF')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('siscoaf')
export class SiscoafController {
  constructor(private readonly siscoafService: SiscoafService) {}

  @Get('stats')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Estatísticas do SISCOAF' })
  async getStats() {
    return this.siscoafService.getStats();
  }

  @Post('indicators')
  @Roles('admin', 'siscoaf:configure')
  @ApiOperation({ summary: 'Criar indicador SISCOAF' })
  @ApiResponse({ status: 201, description: 'Indicador criado com sucesso' })
  async createIndicator(@Body() createIndicatorDto: CreateIndicatorDto) {
    return this.siscoafService.createIndicator(createIndicatorDto);
  }

  @Get('indicators')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:view')
  @ApiOperation({ summary: 'Listar indicadores SISCOAF' })
  async findAllIndicators(@Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.siscoafService.findAllIndicators(isActive);
  }

  @Get('indicators/:id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:view')
  @ApiOperation({ summary: 'Obter indicador por ID' })
  @ApiResponse({ status: 404, description: 'Indicador não encontrado' })
  async findOneIndicator(@Param('id') id: string) {
    return this.siscoafService.findOneIndicator(id);
  }

  @Put('indicators/:id')
  @Roles('admin', 'siscoaf:configure')
  @ApiOperation({ summary: 'Atualizar indicador' })
  @ApiResponse({ status: 404, description: 'Indicador não encontrado' })
  async updateIndicator(@Param('id') id: string, @Body() updateIndicatorDto: UpdateIndicatorDto) {
    return this.siscoafService.updateIndicator(id, updateIndicatorDto);
  }

  @Delete('indicators/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover indicador' })
  @ApiResponse({ status: 200, description: 'Indicador removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Indicador não encontrado' })
  async removeIndicator(@Param('id') id: string) {
    return this.siscoafService.removeIndicator(id);
  }

  @Post('analyses')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:analyze')
  @ApiOperation({ summary: 'Realizar análise SISCOAF automática' })
  @ApiResponse({ status: 201, description: 'Análise realizada com sucesso' })
  async createAnalysis(@Body() createAnalysisDto: CreateAnalysisDto) {
    return this.siscoafService.createAnalysis(createAnalysisDto);
  }

  @Get('analyses')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:view')
  @ApiOperation({ summary: 'Listar análises SISCOAF' })
  async findAllAnalyses(
    @Query('protocolId') protocolId?: string,
    @Query('riskLevel') riskLevel?: string,
  ) {
    return this.siscoafService.findAllAnalyses(protocolId, riskLevel);
  }

  @Get('analyses/:id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'siscoaf:view')
  @ApiOperation({ summary: 'Obter análise por ID' })
  @ApiResponse({ status: 404, description: 'Análise não encontrada' })
  async findOneAnalysis(@Param('id') id: string) {
    return this.siscoafService.findOneAnalysis(id);
  }

  @Post('analyses/:id/decision')
  @Roles('admin', 'tabeliao', 'siscoaf:communicate')
  @ApiOperation({ summary: 'Tomar decisão sobre análise' })
  async makeDecision(
    @Param('id') id: string,
    @Body('decision') decision: string,
    @CurrentUser() user: any,
  ) {
    return this.siscoafService.makeDecision(id, decision, user.id);
  }

  @Get('parameters')
  @Roles('admin', 'siscoaf:configure')
  @ApiOperation({ summary: 'Listar parâmetros de configuração' })
  async getParameters() {
    return this.siscoafService.getParameters();
  }

  @Put('parameters')
  @Roles('admin', 'siscoaf:configure')
  @ApiOperation({ summary: 'Criar/atualizar parâmetro' })
  async upsertParameter(@Body() upsertDto: UpsertParameterDto) {
    return this.siscoafService.upsertParameter(upsertDto);
  }

  @Delete('parameters/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover parâmetro' })
  @ApiResponse({ status: 404, description: 'Parâmetro não encontrado' })
  async deleteParameter(@Param('id') id: string) {
    return this.siscoafService.deleteParameter(id);
  }
}
