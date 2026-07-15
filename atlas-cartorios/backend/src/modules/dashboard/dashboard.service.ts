import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalProtocols = await this.prisma.protocol.count({
      where: { deletedAt: null },
    });

    const protocolsByStatus = await this.prisma.protocol.groupBy({
      by: ['status'],
      _count: true,
      where: { deletedAt: null },
    });

    const protocolsByService = await this.prisma.protocol.groupBy({
      by: ['serviceType'],
      _count: true,
      where: { deletedAt: null },
    });

    const totalPeople = await this.prisma.person.count({
      where: { deletedAt: null },
    });

    const totalProperties = await this.prisma.property.count({
      where: { deletedAt: null },
    });

    const pendingAnalyses = await this.prisma.siscoafAnalysis.count({
      where: { decision: 'PENDENTE' },
    });

    const recentProtocols = await this.prisma.protocol.findMany({
      where: { deletedAt: null },
      orderBy: { dataAbertura: 'desc' },
      take: 10,
      include: {
        escrevente: { select: { id: true, name: true } },
        parties: {
          take: 2,
          include: { person: { select: { id: true, name: true } } },
        },
        _count: { select: { documents: true } },
      },
    });

    return {
      totalProtocols,
      totalPeople,
      totalProperties,
      pendingAnalyses,
      protocolsByStatus: protocolsByStatus.map((s) => ({ status: s.status, count: s._count })),
      protocolsByService: protocolsByService.map((s) => ({ serviceType: s.serviceType, count: s._count })),
      recentProtocols,
    };
  }

  async getMonthlyData(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const protocols = await this.prisma.protocol.findMany({
      where: {
        deletedAt: null,
        dataAbertura: {
          gte: new Date(`${targetYear}-01-01`),
          lte: new Date(`${targetYear}-12-31`),
        },
      },
      select: {
        dataAbertura: true,
        status: true,
        serviceType: true,
      },
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(targetYear, i, 1).toLocaleString('pt-BR', { month: 'short' }),
      total: 0,
      completed: 0,
      canceled: 0,
    }));

    for (const p of protocols) {
      const month = new Date(p.dataAbertura).getMonth();
      monthlyData[month].total++;
      if (p.status === 'CONCLUIDO') monthlyData[month].completed++;
      if (p.status === 'CANCELADO') monthlyData[month].canceled++;
    }

    return monthlyData;
  }

  async getEscreventePerformance() {
    const escreventes = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        protocols: { some: {} },
      },
      include: {
        _count: {
          select: {
            protocols: true,
          },
        },
      },
    });

    const performance = await Promise.all(
      escreventes.map(async (user) => {
        const totalProtocols = user._count.protocols;
        const completedProtocols = await this.prisma.protocol.count({
          where: { escreventeId: user.id, status: 'CONCLUIDO' },
        });

        return {
          id: user.id,
          name: user.name,
          totalProtocols,
          completedProtocols,
          completionRate: totalProtocols > 0 ? Math.round((completedProtocols / totalProtocols) * 100) : 0,
        };
      }),
    );

    return performance.sort((a, b) => b.totalProtocols - a.totalProtocols);
  }

  async getAverageServiceTime() {
    const protocols = await this.prisma.protocol.findMany({
      where: {
        deletedAt: null,
        status: 'CONCLUIDO',
        dataConclusao: { not: null },
        dataAbertura: { not: null },
      },
      select: {
        dataAbertura: true,
        dataConclusao: true,
        serviceType: true,
      },
    });

    const byType: Record<string, { total: number; count: number }> = {};

    for (const p of protocols) {
      const diffMs = p.dataConclusao!.getTime() - p.dataAbertura.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (!byType[p.serviceType]) {
        byType[p.serviceType] = { total: 0, count: 0 };
      }
      byType[p.serviceType].total += diffDays;
      byType[p.serviceType].count++;
    }

    const averages = Object.entries(byType).map(([serviceType, data]) => ({
      serviceType,
      averageDays: Math.round((data.total / data.count) * 10) / 10,
      totalProtocols: data.count,
    }));

    const overall = protocols.length > 0
      ? Math.round(
          (protocols.reduce((sum, p) => {
            const diffMs = p.dataConclusao!.getTime() - p.dataAbertura.getTime();
            return sum + Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          }, 0) / protocols.length) * 10,
        ) / 10
      : 0;

    return {
      overallAverageDays: overall,
      byServiceType: averages,
    };
  }
}
