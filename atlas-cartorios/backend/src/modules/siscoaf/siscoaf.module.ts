import { Module } from '@nestjs/common';
import { SiscoafController } from './siscoaf.controller';
import { SiscoafService } from './siscoaf.service';
import { SiscoafEvaluator } from './engine/siscoaf-evaluator';

@Module({
  controllers: [SiscoafController],
  providers: [SiscoafService, SiscoafEvaluator],
  exports: [SiscoafService],
})
export class SiscoafModule {}
