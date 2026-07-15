import { Injectable, Logger } from '@nestjs/common';
import { ConditionEvaluator } from './conditions';
import { ActionExecutor } from './actions';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RuleEngineCore {
  private readonly logger = new Logger(RuleEngineCore.name);
  private readonly conditionEvaluator: ConditionEvaluator;
  private readonly actionExecutor: ActionExecutor;

  constructor(private prisma: PrismaService) {
    this.conditionEvaluator = new ConditionEvaluator();
    this.actionExecutor = new ActionExecutor();
  }

  async evaluateRules(context: Record<string, any>, category?: string): Promise<any[]> {
    const where: any = { active: true };
    if (category) where.category = category;

    const rules = await this.prisma.rule.findMany({
      where,
      orderBy: { priority: 'desc' },
    });

    this.logger.log(`Evaluating ${rules.length} rules for context`);

    const allResults: any[] = [];

    for (const rule of rules) {
      try {
        const conditionsMet = this.conditionEvaluator.evaluate(rule.conditions as any, context);

        if (conditionsMet) {
          this.logger.log(`Rule "${rule.name}" triggered`);
          const actionResults = await this.actionExecutor.execute(rule.actions as any, context);
          allResults.push({
            ruleId: rule.id,
            ruleName: rule.name,
            matched: true,
            actions: actionResults,
          });
        }
      } catch (error) {
        this.logger.error(`Error evaluating rule "${rule.name}": ${error.message}`);
        allResults.push({
          ruleId: rule.id,
          ruleName: rule.name,
          matched: false,
          error: error.message,
        });
      }
    }

    return allResults;
  }

  async evaluateRuleById(ruleId: string, context: Record<string, any>): Promise<any> {
    const rule = await this.prisma.rule.findUnique({ where: { id: ruleId } });

    if (!rule) {
      throw new Error(`Rule ${ruleId} not found`);
    }

    if (!rule.active) {
      return { ruleId, ruleName: rule.name, matched: false, reason: 'Rule is inactive' };
    }

    const conditionsMet = this.conditionEvaluator.evaluate(rule.conditions as any, context);

    if (conditionsMet) {
      const actionResults = await this.actionExecutor.execute(rule.actions as any, context);
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched: true,
        actions: actionResults,
      };
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched: false,
    };
  }
}
