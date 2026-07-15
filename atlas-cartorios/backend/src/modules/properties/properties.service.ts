import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const existing = await this.prisma.property.findUnique({
      where: { matricula: createPropertyDto.matricula },
    });

    if (existing) {
      throw new ConflictException('Matrícula já cadastrada');
    }

    const property = await this.prisma.property.create({
      data: createPropertyDto,
    });

    this.logger.log(`Property created: ${property.matricula}`);
    return property;
  }

  async findAll(filter: PropertyFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = filter;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { matricula: { contains: search, mode: 'insensitive' } },
        { endereco: { contains: search, mode: 'insensitive' } },
        { municipio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.property.count({ where }),
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
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property || property.deletedAt) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property || property.deletedAt) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    if (updatePropertyDto.matricula && updatePropertyDto.matricula !== property.matricula) {
      const existing = await this.prisma.property.findUnique({
        where: { matricula: updatePropertyDto.matricula },
      });
      if (existing) {
        throw new ConflictException('Matrícula já cadastrada');
      }
    }

    const updated = await this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
    });

    this.logger.log(`Property updated: ${updated.matricula}`);
    return updated;
  }

  async remove(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });

    if (!property || property.deletedAt) {
      throw new NotFoundException('Imóvel não encontrado');
    }

    await this.prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Property soft-deleted: ${property.matricula}`);
    return { message: 'Imóvel removido com sucesso' };
  }
}
