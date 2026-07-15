'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { decisionTreeNodes } from '@/lib/mock/siscoaf';
import { ChevronRight, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type TreeNode = {
  id: string;
  label: string;
  type: 'question' | 'action';
  children?: TreeNode[];
};

export default function DecisionTreePage() {
  const [currentNode, setCurrentNode] = useState<TreeNode>(decisionTreeNodes);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  function handleAnswer(child: TreeNode) {
    setHistory([...history, currentNode]);
    if (child.type === 'action') {
      setIsComplete(true);
      toast.success(`Ação recomendada: ${child.label}`);
    }
    setCurrentNode(child);
  }

  function handleReset() {
    setCurrentNode(decisionTreeNodes);
    setHistory([]);
    setIsComplete(false);
  }

  function handleBack() {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNode(prev);
      setIsComplete(false);
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Árvore de Decisão SISCOAF</h1>
          <p className="text-sm text-muted-foreground">Assistente para análise de conformidade</p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />Reiniciar
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {history.length > 0 && (
          <Button variant="link" size="sm" onClick={handleBack} className="p-0 h-auto">
            Voltar
          </Button>
        )}
        {history.map((h, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{h.label}</span>
          </span>
        ))}
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {currentNode.type === 'question' ? (
              <HelpCircle className="h-5 w-5 text-primary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}
            {currentNode.type === 'question' ? 'Pergunta' : 'Ação Recomendada'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentNode.label}</p>

          {currentNode.type === 'question' && currentNode.children && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Selecione uma opção para continuar:</p>
              {currentNode.children.map((child) => (
                <Button
                  key={child.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswer(child)}
                >
                  <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>{child.label}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {child.type === 'question' ? 'Pergunta' : 'Ação'}
                  </Badge>
                </Button>
              ))}
            </div>
          )}

          {currentNode.type === 'action' && isComplete && (
            <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-sm text-emerald-800">
                Análise concluída. Siga a ação recomendada acima para prosseguir com a conformidade SISCOAF.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
