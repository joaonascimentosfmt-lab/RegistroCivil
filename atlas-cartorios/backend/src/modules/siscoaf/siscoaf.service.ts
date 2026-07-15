import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpsertParameterDto } from './dto/siscoaf-config.dto';
import { SiscoafEvaluator } from './engine/siscoaf-evaluator';

@Injectable()
export class SiscoafService {
  private readonly logger = new Logger(SiscoafService.name);

  constructor(
    private prisma: PrismaService,
    private siscoafEvaluator: SiscoafEvaluator,
  ) {}

  async createIndicator(createIndicatorDto: CreateIndicatorDto) {
    const indicator = await this.prisma.siscoafIndicator.create({
      data: {
        ...createIndicatorDto,
        isRequired: createIndicatorDto.isRequired ?? false,
        isOptional: createIndicatorDto.isOptional ?? true,
        active: createIndicatorDto.active ?? true,
      },
    });

    this.logger.log(`SISCOAF indicator created: ${indicator.description}`);
    return indicator;
  }

  async findAllIndicators(active?: boolean) {
    const where: any = {};
    if (active !== undefined) where.active = active;

    return this.prisma.siscoafIndicator.findMany({
      where,
      orderBy: { category: 'asc' },
    });
  }

  async findOneIndicator(id: string) {
    const indicator = await this.prisma.siscoafIndicator.findUnique({
      where: { id },
    });

    if (!indicator) {
      throw new NotFoundException('Indicador não encontrado');
    }

    return indicator;
  }

  async updateIndicator(id: string, updateIndicatorDto: UpdateIndicatorDto) {
    const indicator = await this.prisma.siscoafIndicator.findUnique({
      where: { id },
    });

    if (!indicator) {
      throw new NotFoundException('Indicador não encontrado');
    }

    const updated = await this.prisma.siscoafIndicator.update({
      where: { id },
      data: updateIndicatorDto,
    });

    return updated;
  }

  async removeIndicator(id: string) {
    const indicator = await this.prisma.siscoafIndicator.findUnique({
      where: { id },
    });

    if (!indicator) {
      throw new NotFoundException('Indicador não encontrado');
    }

    await this.prisma.siscoafIndicator.delete({ where: { id } });

    return { message: 'Indicador removido com sucesso' };
  }

  async createAnalysis(createAnalysisDto: CreateAnalysisDto) {
    return this.siscoafEvaluator.autoAnalyze(
      createAnalysisDto.protocolId,
      {
        justification: createAnalysisDto.justification,
        recommendation: createAnalysisDto.recommendation,
      },
    );
  }

  async findAllAnalyses(protocolId?: string, riskLevel?: string) {
    const where: any = {};
    if (protocolId) where.protocolId = protocolId;
    if (riskLevel) where.riskLevel = riskLevel;

    return this.prisma.siscoafAnalysis.findMany({
      where,
      include: {
        protocol: { select: { id: true, numero: true, serviceType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAnalysis(id: string) {
    const analysis = await this.prisma.siscoafAnalysis.findUnique({
      where: { id },
      include: {
        protocol: {
          select: { id: true, numero: true, serviceType: true, valor: true },
        },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Análise não encontrada');
    }

    return analysis;
  }

  async makeDecision(analysisId: string, decision: string, userId: string) {
    return this.siscoafEvaluator.makeDecision(analysisId, decision, userId);
  }

  async getParameters() {
    return this.prisma.siscoafParameter.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async upsertParameter(upsertDto: UpsertParameterDto) {
    const param = await this.prisma.siscoafParameter.upsert({
      where: { key: upsertDto.key },
      update: {
        name: upsertDto.name,
        value: upsertDto.value,
        description: upsertDto.description,
        category: upsertDto.category,
      },
      create: upsertDto,
    });

    return param;
  }

  async deleteParameter(id: string) {
    const param = await this.prisma.siscoafParameter.findUnique({
      where: { id },
    });

    if (!param) {
      throw new NotFoundException('Parâmetro não encontrado');
    }

    await this.prisma.siscoafParameter.delete({ where: { id } });

    return { message: 'Parâmetro removido com sucesso' };
  }

  async getStats() {
    const totalAnalyses = await this.prisma.siscoafAnalysis.count();
    const pendingAnalyses = await this.prisma.siscoafAnalysis.count({
      where: { decision: 'PENDENTE' },
    });
    const byRisk = await this.prisma.siscoafAnalysis.groupBy({
      by: ['riskLevel'],
      _count: true,
    });
    const byDecision = await this.prisma.siscoafAnalysis.groupBy({
      by: ['decision'],
      _count: true,
    });

    return {
      totalAnalyses,
      pendingAnalyses,
      byRisk: byRisk.map((r) => ({ riskLevel: r.riskLevel, count: r._count })),
      byDecision: byDecision.map((d) => ({ decision: d.decision, count: d._count })),
    };
  }
}
