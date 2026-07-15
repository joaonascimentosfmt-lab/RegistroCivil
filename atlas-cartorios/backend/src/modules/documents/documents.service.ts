import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentFilterDto } from './dto/document-filter.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, protocolId?: string, personId?: string, type?: string) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const document = await this.prisma.document.create({
      data: {
        protocolId: protocolId || null,
        personId: personId || null,
        type: (type as any) || 'OUTROS',
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        version: 1,
      },
    });

    this.logger.log(`Document uploaded: ${document.originalName}`);
    return document;
  }

  async findAll(filter: DocumentFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, protocolId, personId, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = filter;

    const where: any = { deletedAt: null };

    if (protocolId) where.protocolId = protocolId;
    if (personId) where.personId = personId;
    if (type) where.type = type;
    if (search) {
      where.originalName = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          protocol: { select: { id: true, numero: true } },
          person: { select: { id: true, name: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        protocol: { select: { id: true, numero: true } },
        person: { select: { id: true, name: true } },
      },
    });

    if (!document || document.deletedAt) {
      throw new NotFoundException('Documento não encontrado');
    }

    return document;
  }

  async download(id: string) {
    const document = await this.findOne(id);

    if (!fs.existsSync(document.path)) {
      throw new NotFoundException('Arquivo não encontrado no disco');
    }

    return {
      stream: fs.createReadStream(document.path),
      filename: document.originalName,
      mimeType: document.mimeType,
    };
  }

  async remove(id: string) {
    const document = await this.prisma.document.findUnique({ where: { id } });

    if (!document || document.deletedAt) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Document soft-deleted: ${document.originalName}`);
    return { message: 'Documento removido com sucesso' };
  }
}
