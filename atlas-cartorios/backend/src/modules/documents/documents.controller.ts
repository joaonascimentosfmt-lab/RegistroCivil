import { Controller, Get, Post, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentFilterDto } from './dto/document-filter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Response } from 'express';

@ApiTags('Documentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'recepcao')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de documento' })
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('protocolId') protocolId?: string,
    @Query('personId') personId?: string,
    @Query('type') type?: string,
  ) {
    return this.documentsService.upload(file, protocolId, personId, type);
  }

  @Get()
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'consulta')
  @ApiOperation({ summary: 'Listar documentos' })
  async findAll(@Query() filter: DocumentFilterDto) {
    return this.documentsService.findAll(filter);
  }

  @Get(':id')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'consulta')
  @ApiOperation({ summary: 'Obter documento por ID' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  @Roles('admin', 'tabeliao', 'substituto', 'escrevente', 'consulta')
  @ApiOperation({ summary: 'Download de documento' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const result = await this.documentsService.download(id);
    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    });
    result.stream.pipe(res);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover documento (soft delete)' })
  @ApiResponse({ status: 200, description: 'Documento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
