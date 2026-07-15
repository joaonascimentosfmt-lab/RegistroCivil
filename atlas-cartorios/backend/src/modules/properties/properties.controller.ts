import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Imóveis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Cadastrar novo imóvel' })
  @ApiResponse({ status: 201, description: 'Imóvel cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Matrícula já cadastrada' })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'consulta')
  @ApiOperation({ summary: 'Listar imóveis' })
  async findAll(@Query() filter: PropertyFilterDto) {
    return this.propertiesService.findAll(filter);
  }

  @Get(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'consulta')
  @ApiOperation({ summary: 'Obter imóvel por ID' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Atualizar dados do imóvel' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover imóvel (soft delete)' })
  @ApiResponse({ status: 200, description: 'Imóvel removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
