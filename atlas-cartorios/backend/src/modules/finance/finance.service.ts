import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getRecords(params: {
    page?: number;
    limit?: number;
    protocolId?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, protocolId, type, status, startDate, endDate } = params;

    const where: any = {};

    if (protocolId) where.protocolId = protocolId;
    if (type) where.type = type;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.financeRecord.findMany({
        where,
        include: {
          protocol: { select: { id: true, numero: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.financeRecord.count({ where }),
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

  async createRecord(data: {
    protocolId?: string;
    description: string;
    value: number;
    type: string;
    status: string;
    paymentMethod?: string;
    dueDate?: string;
    paidAt?: string;
  }) {
    return this.prisma.financeRecord.create({
      data: {
        protocolId: data.protocolId,
        description: data.description,
        value: data.value,
        type: data.type,
        status: data.status,
        paymentMethod: data.paymentMethod,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paidAt: data.paidAt ? new Date(data.paidAt) : null,
      } as any,
    });
  }

  async updateRecord(id: string, data: {
    description?: string;
    value?: number;
    type?: string;
    status?: string;
    paymentMethod?: string;
    dueDate?: string;
    paidAt?: string;
  }) {
    const record = await this.prisma.financeRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException('Registro financeiro não encontrado');
    }

    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.paidAt) updateData.paidAt = new Date(data.paidAt);

    return this.prisma.financeRecord.update({
      where: { id },
      data: updateData,
    });
  }

  async removeRecord(id: string) {
    const record = await this.prisma.financeRecord.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException('Registro financeiro não encontrado');
    }

    await this.prisma.financeRecord.delete({ where: { id } });

    return { message: 'Registro financeiro removido com sucesso' };
  }

  async getSummary(params: { startDate?: string; endDate?: string }) {
    const where: any = {};
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const records = await this.prisma.financeRecord.findMany({ where });

    const receitas = records.filter((r) => r.type === 'RECEITA');
    const despesas = records.filter((r) => r.type === 'DESPESA');

    const totalReceitas = receitas.reduce((sum, r) => sum + Number(r.value), 0);
    const totalDespesas = despesas.reduce((sum, r) => sum + Number(r.value), 0);

    const pendentes = records.filter((r) => r.status === 'PENDENTE');
    const pagos = records.filter((r) => r.status === 'PAGO');

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      totalRecords: records.length,
      receitasCount: receitas.length,
      despesasCount: despesas.length,
      pendentesCount: pendentes.length,
      pagosCount: pagos.length,
      valorPendente: pendentes.reduce((sum, r) => sum + Number(r.value), 0),
    };
  }
}
