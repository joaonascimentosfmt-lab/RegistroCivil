import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ScoringEngine, EvaluatedIndicator } from './scoring';

@Injectable()
export class SiscoafEvaluator {
  private readonly logger = new Logger(SiscoafEvaluator.name);
  private readonly scoringEngine: ScoringEngine;

  constructor(private prisma: PrismaService) {
    this.scoringEngine = new ScoringEngine();
  }

  async autoAnalyze(protocolId: string, context: Record<string, any> = {}) {
    this.logger.log(`Starting auto-analysis for protocol ${protocolId}`);

    const protocol = await this.prisma.protocol.findUnique({
      where: { id: protocolId },
      include: {
        parties: { include: { person: true } },
        properties: { include: { property: true } },
      },
    });

    if (!protocol) {
      throw new Error('Protocolo não encontrado');
    }

    const fullContext = {
      ...context,
      valor: protocol.valor,
      serviceType: protocol.serviceType,
      partes: protocol.parties.map((p) => ({
        id: p.person.id,
        name: p.person.name,
        cpf: p.person.cpf,
        cnpj: p.person.cnpj,
        nacionalidade: p.person.nacionalidade,
      })),
      propriedades: protocol.properties.map((p) => ({
        id: p.property.id,
        matricula: p.property.matricula,
        endereco: p.property.endereco,
        municipio: p.property.municipio,
        area: p.property.area,
      })),
    };

    const indicators = await this.prisma.siscoafIndicator.findMany({
      where: { active: true },
    });

    const evaluatedIndicators: EvaluatedIndicator[] = indicators.map((ind) =>
      this.scoringEngine.evaluateIndicator(
        {
          id: ind.id,
          description: ind.description,
          weight: ind.weight,
          category: ind.category,
          isRequired: ind.isRequired,
        },
        fullContext,
      ),
    );

    await this.loadThresholds();

    const result = this.scoringEngine.calculateScore(evaluatedIndicators);

    this.logger.log(`Analysis complete for protocol ${protocolId}: score=${result.score}, risk=${result.riskLevel}`);

    const analysis = await this.prisma.siscoafAnalysis.create({
      data: {
        protocolId,
        score: result.score,
        riskLevel: result.riskLevel,
        indicators: evaluatedIndicators as any,
        decision: 'PENDENTE',
      },
    });

    return analysis;
  }

  private async loadThresholds() {
    const params = await this.prisma.siscoafParameter.findMany({
      where: { category: 'thresholds' },
    });

    const thresholds: Record<string, number> = {};
    for (const param of params) {
      thresholds[param.key] = parseInt(param.value) || 0;
    }

    if (thresholds.veryHighThreshold) {
      this.scoringEngine.setThresholds({
        veryHigh: thresholds.veryHighThreshold,
        high: thresholds.highThreshold || 50,
        medium: thresholds.mediumThreshold || 30,
      });
    }
  }

  async makeDecision(analysisId: string, decision: string, userId: string) {
    const validDecisions = ['COMUNICAR', 'NAO_COMUNICAR', 'PENDENTE'];

    if (!validDecisions.includes(decision)) {
      throw new Error(`Decisão inválida. Use: ${validDecisions.join(', ')}`);
    }

    const analysis = await this.prisma.siscoafAnalysis.update({
      where: { id: analysisId },
      data: {
        decision,
        analyzedById: userId,
        analyzedAt: new Date(),
      },
    });

    this.logger.log(`Analysis ${analysisId} decision: ${decision}`);
    return analysis;
  }
}
