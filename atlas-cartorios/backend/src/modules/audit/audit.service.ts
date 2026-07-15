import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditFilterDto } from './dto/audit-filter.dto';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(data: {
    action: string;
    entity: string;
    entityId?: string;
    userId?: string;
    userEmail?: string;
    method?: string;
    url?: string;
    details?: any;
    ip?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          userId: data.userId,
          userEmail: data.userEmail,
          method: data.method,
          url: data.url,
          details: data.details || {},
          ip: data.ip,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to log audit entry: ${error.message}`);
    }
  }

  async findAll(filter: AuditFilterDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, startDate, endDate, userEmail, action, entity, sortBy = 'createdAt', sortOrder = 'desc' } = filter;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (userEmail) where.userEmail = { contains: userEmail, mode: 'insensitive' };
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (entity) where.entity = entity;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.auditLog.count({ where }),
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
    return this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getStats() {
    const total = await this.prisma.auditLog.count();
    const last24h = await this.prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    const byAction = await this.prisma.auditLog.groupBy({
      by: ['action'],
      _count: true,
      orderBy: { _count: { action: 'desc' } },
      take: 10,
    });

    const byEntity = await this.prisma.auditLog.groupBy({
      by: ['entity'],
      _count: true,
      orderBy: { _count: { entity: 'desc' } },
      take: 10,
    });

    return {
      total,
      last24h,
      topActions: byAction.map((a) => ({ action: a.action, count: a._count })),
      topEntities: byEntity.map((e) => ({ entity: e.entity, count: e._count })),
    };
  }
}
