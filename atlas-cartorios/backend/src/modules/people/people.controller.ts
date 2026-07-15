import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonFilterDto } from './dto/person-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Pessoas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @ApiOperation({ summary: 'Cadastrar nova pessoa (PF ou PJ)' })
  @ApiResponse({ status: 201, description: 'Pessoa cadastrada com sucesso' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado' })
  async create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao', 'financeiro', 'consulta')
  @ApiOperation({ summary: 'Listar pessoas' })
  async findAll(@Query() filter: PersonFilterDto) {
    return this.peopleService.findAll(filter);
  }

  @Get(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao', 'financeiro', 'consulta')
  @ApiOperation({ summary: 'Obter pessoa por ID' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente')
  @ApiOperation({ summary: 'Atualizar dados da pessoa' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover pessoa (soft delete)' })
  @ApiResponse({ status: 200, description: 'Pessoa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Pessoa não encontrada' })
  async remove(@Param('id') id: string) {
    return this.peopleService.remove(id);
  }
}
