import { RiskLevel } from '@prisma/client';

export interface ScoringResult {
  score: number;
  riskLevel: RiskLevel;
  maxScore: number;
  evaluatedIndicators: EvaluatedIndicator[];
}

export interface EvaluatedIndicator {
  indicatorId: string;
  description: string;
  weight: number;
  category: string;
  triggered: boolean;
  score: number;
  details?: string;
}

export class ScoringEngine {
  private thresholds: {
    veryHigh: number;
    high: number;
    medium: number;
  };

  constructor() {
    this.thresholds = {
      veryHigh: 70,
      high: 50,
      medium: 30,
    };
  }

  setThresholds(thresholds: { veryHigh: number; high: number; medium: number }) {
    this.thresholds = thresholds;
  }

  calculateScore(indicators: EvaluatedIndicator[]): ScoringResult {
    const maxScore = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    const score = indicators
      .filter((ind) => ind.triggered)
      .reduce((sum, ind) => sum + ind.score, 0);

    const riskLevel = this.getRiskLevel(score, maxScore);

    return {
      score,
      riskLevel,
      maxScore,
      evaluatedIndicators: indicators,
    };
  }

  evaluateIndicator(indicator: {
    id: string;
    description: string;
    weight: number;
    category: string;
    isRequired: boolean;
  }, context: Record<string, any>): EvaluatedIndicator {
    const triggered = this.checkIndicatorTrigger(indicator, context);
    const score = triggered ? indicator.weight : 0;

    return {
      indicatorId: indicator.id,
      description: indicator.description,
      weight: indicator.weight,
      category: indicator.category,
      triggered,
      score,
      details: triggered ? 'Indicador acionado' : 'Indicador não acionado',
    };
  }

  private checkIndicatorTrigger(indicator: {
    id: string;
    description: string;
    weight: number;
    category: string;
    isRequired: boolean;
  }, context: Record<string, any>): boolean {
    const category = indicator.category;

    switch (category) {
      case 'financial':
        return this.checkFinancialIndicators(indicator.id, context);
      case 'operational':
        return this.checkOperationalIndicators(indicator.id, context);
      case 'documental':
        return this.checkDocumentalIndicators(indicator.id, context);
      case 'parties':
        return this.checkPartiesIndicators(indicator.id, context);
      case 'property':
        return this.checkPropertyIndicators(indicator.id, context);
      default:
        return false;
    }
  }

  private checkFinancialIndicators(indicatorId: string, context: Record<string, any>): boolean {
    const valor = context?.valor || 0;

    switch (indicatorId) {
      case 'high_value':
        return Number(valor) > 1000000;
      case 'fractioned_value':
        return false;
      case 'incompatible_value':
        return false;
      default:
        return false;
    }
  }

  private checkOperationalIndicators(indicatorId: string, context: Record<string, any>): boolean {
    switch (indicatorId) {
      case 'urgent_operation':
        return false;
      case 'unusual_operation':
        return false;
      case 'multiple_operations':
        return false;
      default:
        return false;
    }
  }

  private checkDocumentalIndicators(indicatorId: string, context: Record<string, any>): boolean {
    switch (indicatorId) {
      case 'incomplete_docs':
        return false;
      case 'suspicious_docs':
        return false;
      case 'recent_docs':
        return false;
      default:
        return false;
    }
  }

  private checkPartiesIndicators(indicatorId: string, context: Record<string, any>): boolean {
    switch (indicatorId) {
      case 'foreign_party':
        return false;
      case 'pep_party':
        return false;
      case 'multiple_parties':
        return (context?.parties?.length || 0) > 5;
      default:
        return false;
    }
  }

  private checkPropertyIndicators(indicatorId: string, context: Record<string, any>): boolean {
    switch (indicatorId) {
      case 'rural_property':
        return false;
      case 'multiple_properties':
        return (context?.properties?.length || 0) > 3;
      case 'incompatible_area':
        return false;
      default:
        return false;
    }
  }

  private getRiskLevel(score: number, maxScore: number): RiskLevel {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    if (percentage >= this.thresholds.veryHigh) return RiskLevel.VERY_HIGH;
    if (percentage >= this.thresholds.high) return RiskLevel.HIGH;
    if (percentage >= this.thresholds.medium) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }
}
