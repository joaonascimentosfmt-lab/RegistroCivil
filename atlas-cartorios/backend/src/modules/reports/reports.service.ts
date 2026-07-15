import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async getProtocolsReport(params: {
    startDate?: string;
    endDate?: string;
    status?: string;
    serviceType?: string;
    escreventeId?: string;
  }) {
    const where: any = { deletedAt: null };

    if (params.startDate || params.endDate) {
      where.dataAbertura = {};
      if (params.startDate) where.dataAbertura.gte = new Date(params.startDate);
      if (params.endDate) where.dataAbertura.lte = new Date(params.endDate);
    }

    if (params.status) where.status = params.status;
    if (params.serviceType) where.serviceType = params.serviceType;
    if (params.escreventeId) where.escreventeId = params.escreventeId;

    const protocols = await this.prisma.protocol.findMany({
      where,
      include: {
        escrevente: { select: { id: true, name: true } },
        parties: { include: { person: { select: { id: true, name: true, cpf: true } } } },
        properties: { include: { property: { select: { id: true, matricula: true, endereco: true } } } },
      },
      orderBy: { dataAbertura: 'desc' },
    });

    return {
      generatedAt: new Date().toISOString(),
      totalProtocols: protocols.length,
      filters: params,
      protocols,
    };
  }

  async getServicesReport(params: { startDate?: string; endDate?: string }) {
    const where: any = { deletedAt: null };

    if (params.startDate || params.endDate) {
      where.dataAbertura = {};
      if (params.startDate) where.dataAbertura.gte = new Date(params.startDate);
      if (params.endDate) where.dataAbertura.lte = new Date(params.endDate);
    }

    const byService = await this.prisma.protocol.groupBy({
      by: ['serviceType'],
      _count: true,
      where,
    });

    const total = byService.reduce((sum, s) => sum + s._count, 0);

    const details = await Promise.all(
      byService.map(async (s) => {
        const completed = await this.prisma.protocol.count({
          where: { ...where, serviceType: s.serviceType, status: 'CONCLUIDO' },
        });
        return {
          serviceType: s.serviceType,
          total: s._count,
          completed,
          pending: s._count - completed,
          percentage: total > 0 ? Math.round((s._count / total) * 100) : 0,
        };
      }),
    );

    return {
      generatedAt: new Date().toISOString(),
      totalProtocols: total,
      byService: details,
    };
  }

  async getFinanceReport(params: { startDate?: string; endDate?: string }) {
    const where: any = { deletedAt: null };

    if (params.startDate || params.endDate) {
      where.dataAbertura = {};
      if (params.startDate) where.dataAbertura.gte = new Date(params.startDate);
      if (params.endDate) where.dataAbertura.lte = new Date(params.endDate);
    }

    const protocols = await this.prisma.protocol.findMany({
      where: {
        ...where,
        valor: { not: null },
      },
      select: {
        id: true,
        numero: true,
        serviceType: true,
        valor: true,
        dataAbertura: true,
        status: true,
      },
    });

    const totalValue = protocols.reduce((sum, p) => sum + Number(p.valor || 0), 0);
    const paidProtocols = protocols.filter((p) => p.status === 'CONCLUIDO');
    const paidValue = paidProtocols.reduce((sum, p) => sum + Number(p.valor || 0), 0);

    const byService = protocols.reduce(
      (acc, p) => {
        const type = p.serviceType;
        if (!acc[type]) acc[type] = { total: 0, count: 0, value: 0 };
        acc[type].count++;
        acc[type].value += Number(p.valor || 0);
        return acc;
      },
      {} as Record<string, { total: number; count: number; value: number }>,
    );

    return {
      generatedAt: new Date().toISOString(),
      totalProtocols: protocols.length,
      totalValue,
      paidProtocols: paidProtocols.length,
      paidValue,
      averageValue: protocols.length > 0 ? totalValue / protocols.length : 0,
      byServiceType: Object.entries(byService).map(([serviceType, data]) => ({
        serviceType,
        count: data.count,
        totalValue: data.value,
      })),
      protocols,
    };
  }

  async getSiscoafReport(params: { startDate?: string; endDate?: string }) {
    const where: any = {};

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const analyses = await this.prisma.siscoafAnalysis.findMany({
      where,
      include: {
        protocol: { select: { id: true, numero: true, serviceType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const byRisk = analyses.reduce(
      (acc, a) => {
        acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byDecision = analyses.reduce(
      (acc, a) => {
        const decision = a.decision || 'PENDENTE';
        acc[decision] = (acc[decision] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      generatedAt: new Date().toISOString(),
      totalAnalyses: analyses.length,
      byRisk,
      byDecision,
      analyses,
    };
  }

  async getProductivityReport(params: { startDate?: string; endDate?: string }) {
    const where: any = { deletedAt: null };

    if (params.startDate || params.endDate) {
      where.dataAbertura = {};
      if (params.startDate) where.dataAbertura.gte = new Date(params.startDate);
      if (params.endDate) where.dataAbertura.lte = new Date(params.endDate);
    }

    const users = await this.prisma.user.findMany({
      where: { deletedAt: null, isActive: true },
      include: {
        _count: {
          select: { protocols: true },
        },
      },
    });

    const productivity = await Promise.all(
      users.map(async (user) => {
        const userWhere = { ...where, escreventeId: user.id };
        const total = await this.prisma.protocol.count({ where: userWhere });
        const completed = await this.prisma.protocol.count({
          where: { ...userWhere, status: 'CONCLUIDO' },
        });

        return {
          id: user.id,
          name: user.name,
          totalProtocols: total,
          completedProtocols: completed,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }),
    );

    return {
      generatedAt: new Date().toISOString(),
      users: productivity.sort((a, b) => b.totalProtocols - a.totalProtocols),
    };
  }
}
