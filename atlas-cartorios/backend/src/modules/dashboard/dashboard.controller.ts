import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao', 'financeiro', 'consulta')
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('monthly')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter dados mensais de protocolos' })
  async getMonthlyData(@Query('year') year?: string) {
    return this.dashboardService.getMonthlyData(year ? parseInt(year) : undefined);
  }

  @Get('escreventes')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Performance dos escreventes' })
  async getEscreventePerformance() {
    return this.dashboardService.getEscreventePerformance();
  }

  @Get('service-time')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Tempo médio de serviço' })
  async getAverageServiceTime() {
    return this.dashboardService.getAverageServiceTime();
  }
}
