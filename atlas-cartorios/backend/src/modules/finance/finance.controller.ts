import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Financeiro')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  @Roles('admin', 'financeiro', 'finance:view')
  @ApiOperation({ summary: 'Resumo financeiro' })
  async getSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getSummary({ startDate, endDate });
  }

  @Get('records')
  @Roles('admin', 'financeiro', 'finance:view')
  @ApiOperation({ summary: 'Listar registros financeiros' })
  async getRecords(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('protocolId') protocolId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getRecords({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      protocolId,
      type,
      status,
      startDate,
      endDate,
    });
  }

  @Post('records')
  @Roles('admin', 'financeiro', 'finance:manage')
  @ApiOperation({ summary: 'Criar registro financeiro' })
  @ApiResponse({ status: 201, description: 'Registro criado com sucesso' })
  async createRecord(@Body() data: any) {
    return this.financeService.createRecord(data);
  }

  @Put('records/:id')
  @Roles('admin', 'financeiro', 'finance:manage')
  @ApiOperation({ summary: 'Atualizar registro financeiro' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async updateRecord(@Param('id') id: string, @Body() data: any) {
    return this.financeService.updateRecord(id, data);
  }

  @Delete('records/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover registro financeiro' })
  @ApiResponse({ status: 200, description: 'Registro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async removeRecord(@Param('id') id: string) {
    return this.financeService.removeRecord(id);
  }
}
