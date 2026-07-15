import { Injectable, Logger } from '@nestjs/common';

interface TreeNode {
  id: string;
  question: string;
  answers?: { label: string; nextNodeId: string }[];
  isLeaf?: boolean;
  result?: string;
}

@Injectable()
export class TreeExecutor {
  private readonly logger = new Logger(TreeExecutor.name);

  execute(nodes: TreeNode[], answers: string[]): {
    path: TreeNode[];
    result: string | null;
    finalNode: TreeNode | null;
  } {
    if (!nodes || nodes.length === 0) {
      throw new Error('Árvore de decisão vazia');
    }

    const nodeMap = new Map<string, TreeNode>();
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    const root = nodes.find((n) => {
      const hasParent = nodes.some((other) =>
        other.answers?.some((a) => a.nextNodeId === n.id),
      );
      return !hasParent;
    });

    if (!root) {
      throw new Error('Raiz da árvore não encontrada');
    }

    const path: TreeNode[] = [];
    let currentNode: TreeNode | undefined = root;

    for (const answerId of answers) {
      if (!currentNode || currentNode.isLeaf) break;

      path.push(currentNode);

      const nextAnswer = currentNode.answers?.find((a) => a.nextNodeId === answerId);
      if (!nextAnswer) {
        this.logger.warn(`Answer ${answerId} not found in node ${currentNode.id}`);
        break;
      }

      currentNode = nodeMap.get(nextAnswer.nextNodeId);
    }

    if (currentNode) {
      path.push(currentNode);
    }

    const finalNode = currentNode && currentNode.isLeaf ? currentNode : null;

    this.logger.log(`Tree executed: path has ${path.length} nodes, result: ${finalNode?.result || 'no final result'}`);

    return {
      path,
      result: finalNode?.result || null,
      finalNode,
    };
  }
}
