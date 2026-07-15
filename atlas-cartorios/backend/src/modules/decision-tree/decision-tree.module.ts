import { Module } from '@nestjs/common';
import { DecisionTreeController } from './decision-tree.controller';
import { DecisionTreeService } from './decision-tree.service';
import { TreeExecutor } from './engine/tree-executor';

@Module({
  controllers: [DecisionTreeController],
  providers: [DecisionTreeService, TreeExecutor],
  exports: [DecisionTreeService],
})
export class DecisionTreeModule {}
