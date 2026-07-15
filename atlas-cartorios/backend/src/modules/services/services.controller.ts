import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { ServiceType } from '@prisma/client';
import { ServiceFilterDto } from './dto/service-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Serviços')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @ApiOperation({ summary: 'Listar todos os serviços disponíveis' })
  async findAll(@Query() filter: ServiceFilterDto) {
    let services = this.servicesService.findAll();
    if (filter.type) {
      services = services.filter((s: any) => s.type === filter.type);
    }
    return services;
  }

  @Get('types')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @ApiOperation({ summary: 'Listar nomes dos tipos de serviço' })
  async getTypes() {
    return this.servicesService.getServiceNames();
  }

  @Get(':type')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @ApiOperation({ summary: 'Obter detalhes de um serviço' })
  async findOne(@Param('type') type: ServiceType) {
    return this.servicesService.findOne(type);
  }

  @Get(':type/checklist')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter checklist de documentos para um serviço' })
  async getChecklist(@Param('type') type: ServiceType) {
    return this.servicesService.getChecklist(type);
  }

  @Get(':type/flow')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Obter fluxo de trabalho para um serviço' })
  async getFlow(@Param('type') type: ServiceType) {
    return this.servicesService.getFlow(type);
  }
}
