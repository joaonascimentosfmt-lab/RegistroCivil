import { Module } from '@nestjs/common';
import { RulesEngineController } from './rules-engine.controller';
import { RulesEngineService } from './rules-engine.service';
import { RuleEngineCore } from './engine/rule-engine.core';

@Module({
  controllers: [RulesEngineController],
  providers: [RulesEngineService, RuleEngineCore],
  exports: [RulesEngineService, RuleEngineCore],
})
export class RulesEngineModule {}
