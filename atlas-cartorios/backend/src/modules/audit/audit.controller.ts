import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditFilterDto } from './dto/audit-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('stats')
  @Roles('admin', 'audit:view')
  @ApiOperation({ summary: 'Estatísticas de auditoria' })
  async getStats() {
    return this.auditService.getStats();
  }

  @Get()
  @Roles('admin', 'audit:view')
  @ApiOperation({ summary: 'Listar logs de auditoria' })
  async findAll(@Query() filter: AuditFilterDto) {
    return this.auditService.findAll(filter);
  }

  @Get(':id')
  @Roles('admin', 'audit:view')
  @ApiOperation({ summary: 'Obter log de auditoria por ID' })
  async findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }
}
