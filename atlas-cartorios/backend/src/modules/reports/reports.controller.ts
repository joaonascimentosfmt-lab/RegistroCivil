import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Relatórios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('protocols')
  @Roles('admin', 'tabeliao', 'substituto', 'financeiro')
  @ApiOperation({ summary: 'Relatório de protocolos' })
  async getProtocolsReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('serviceType') serviceType?: string,
    @Query('escreventeId') escreventeId?: string,
  ) {
    return this.reportsService.getProtocolsReport({ startDate, endDate, status, serviceType, escreventeId });
  }

  @Get('services')
  @Roles('admin', 'tabeliao', 'substituto')
  @ApiOperation({ summary: 'Relatório de serviços' })
  async getServicesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getServicesReport({ startDate, endDate });
  }

  @Get('finance')
  @Roles('admin', 'financeiro')
  @ApiOperation({ summary: 'Relatório financeiro' })
  async getFinanceReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFinanceReport({ startDate, endDate });
  }

  @Get('siscoaf')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Relatório SISCOAF' })
  async getSiscoafReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSiscoafReport({ startDate, endDate });
  }

  @Get('productivity')
  @Roles('admin', 'tabeliao')
  @ApiOperation({ summary: 'Relatório de produtividade' })
  async getProductivityReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getProductivityReport({ startDate, endDate });
  }
}
