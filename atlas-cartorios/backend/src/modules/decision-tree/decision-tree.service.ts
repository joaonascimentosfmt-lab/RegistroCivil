import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { TreeExecutor } from './engine/tree-executor';

@Injectable()
export class DecisionTreeService {
  private readonly logger = new Logger(DecisionTreeService.name);

  constructor(
    private prisma: PrismaService,
    private treeExecutor: TreeExecutor,
  ) {}

  async create(createTreeDto: CreateTreeDto) {
    const tree = await this.prisma.decisionTree.create({
      data: {
        name: createTreeDto.name,
        description: createTreeDto.description,
        nodes: createTreeDto.nodes as any,
        active: createTreeDto.active ?? true,
        version: 1,
      },
    });

    this.logger.log(`Decision tree created: ${tree.name}`);
    return tree;
  }

  async findAll(active?: boolean) {
    const where: any = {};
    if (active !== undefined) where.active = active;

    return this.prisma.decisionTree.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tree = await this.prisma.decisionTree.findUnique({ where: { id } });

    if (!tree) {
      throw new NotFoundException('Árvore de decisão não encontrada');
    }

    return tree;
  }

  async update(id: string, updateTreeDto: UpdateTreeDto) {
    const tree = await this.prisma.decisionTree.findUnique({ where: { id } });

    if (!tree) {
      throw new NotFoundException('Árvore de decisão não encontrada');
    }

    const data: any = { ...updateTreeDto };

    if (updateTreeDto.nodes) {
      data.version = tree.version + 1;
    }

    const updated = await this.prisma.decisionTree.update({
      where: { id },
      data,
    });

    this.logger.log(`Decision tree updated: ${updated.name} (v${updated.version})`);
    return updated;
  }

  async remove(id: string) {
    const tree = await this.prisma.decisionTree.findUnique({ where: { id } });

    if (!tree) {
      throw new NotFoundException('Árvore de decisão não encontrada');
    }

    await this.prisma.decisionTree.delete({ where: { id } });

    this.logger.log(`Decision tree deleted: ${tree.name}`);
    return { message: 'Árvore de decisão removida com sucesso' };
  }

  async evaluate(treeId: string, answers: string[]) {
    const tree = await this.prisma.decisionTree.findUnique({ where: { id: treeId } });

    if (!tree) {
      throw new NotFoundException('Árvore de decisão não encontrada');
    }

    if (!tree.active) {
      throw new Error('Árvore de decisão está inativa');
    }

    const result = this.treeExecutor.execute(tree.nodes as any, answers);

    return {
      treeId: tree.id,
      treeName: tree.name,
      ...result,
    };
  }
}
