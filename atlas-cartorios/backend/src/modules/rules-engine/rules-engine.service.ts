import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RuleEngineCore } from './engine/rule-engine.core';

@Injectable()
export class RulesEngineService {
  private readonly logger = new Logger(RulesEngineService.name);

  constructor(
    private prisma: PrismaService,
    private ruleEngineCore: RuleEngineCore,
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const rule = await this.prisma.rule.create({
      data: {
        name: createRuleDto.name,
        description: createRuleDto.description,
        conditions: createRuleDto.conditions,
        actions: createRuleDto.actions,
        active: createRuleDto.active ?? true,
        priority: createRuleDto.priority ?? 0,
        category: createRuleDto.category,
      },
    });

    this.logger.log(`Rule created: ${rule.name}`);
    return rule;
  }

  async findAll(category?: string) {
    const where: any = {};
    if (category) where.category = category;

    return this.prisma.rule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Regra não encontrada');
    }

    return rule;
  }

  async update(id: string, updateRuleDto: UpdateRuleDto) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Regra não encontrada');
    }

    const updated = await this.prisma.rule.update({
      where: { id },
      data: updateRuleDto,
    });

    this.logger.log(`Rule updated: ${updated.name}`);
    return updated;
  }

  async remove(id: string) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Regra não encontrada');
    }

    await this.prisma.rule.delete({ where: { id } });

    this.logger.log(`Rule deleted: ${rule.name}`);
    return { message: 'Regra removida com sucesso' };
  }

  async evaluate(context: Record<string, any>, category?: string) {
    return this.ruleEngineCore.evaluateRules(context, category);
  }

  async evaluateById(ruleId: string, context: Record<string, any>) {
    return this.ruleEngineCore.evaluateRuleById(ruleId, context);
  }

  async toggleActive(id: string) {
    const rule = await this.prisma.rule.findUnique({ where: { id } });

    if (!rule) {
      throw new NotFoundException('Regra não encontrada');
    }

    const updated = await this.prisma.rule.update({
      where: { id },
      data: { active: !rule.active },
    });

    return updated;
  }
}
