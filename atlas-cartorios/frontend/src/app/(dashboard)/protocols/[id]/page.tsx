'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { protocols } from '@/lib/mock/protocols';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Pencil, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'destructive'> = {
  ABERTO: 'default',
  EM_ANDAMENTO: 'info',
  AGUARDANDO_DOCUMENTOS: 'warning',
  SISCOAF_PENDENTE: 'destructive',
  CONCLUIDO: 'success',
  CANCELADO: 'destructive',
};

function fetchProtocol(id: string) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(protocols.find((p) => p.id === id)), 300)
  );
}

export default function ProtocolDetailPage() {
  const params = useParams();
  const { data: protocol, isLoading } = useQuery({
    queryKey: ['protocol', params.id],
    queryFn: () => fetchProtocol(params.id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <p className="text-lg font-medium">Protocolo não encontrado</p>
        <Link href="/protocols"><Button variant="outline">Voltar para lista</Button></Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/protocols">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Protocolo {protocol.numero}</h1>
              <Badge variant={statusColors[protocol.status]} className="text-xs">
                {protocol.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Criado em {protocol.data}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
            <FileText className="mr-2 h-4 w-4" />Gerar Certidão
          </Button>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />Editar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Informações do Protocolo</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Número:</span>
                <p className="font-medium">{protocol.numero}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium">{protocol.cliente}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <p className="font-medium">{protocol.tipo}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p><Badge variant={statusColors[protocol.status]}>{protocol.status.replace('_', ' ')}</Badge></p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor:</span>
                <p className="font-medium">{formatCurrency(protocol.valor)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Escrevente:</span>
                <p className="font-medium">{protocol.escrevente}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data de Abertura:</span>
                <p className="font-medium">{protocol.data}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data de Conclusão:</span>
                <p className="font-medium">{protocol.dataConclusao || 'Pendente'}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <span className="text-sm text-muted-foreground">Observações:</span>
              <p className="mt-1 text-sm">{protocol.observacoes || 'Nenhuma observação registrada.'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Partes Envolvidas</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{protocol.cliente}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Documentos</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nenhum documento anexado.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Histórico</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">{protocol.data} - Protocolo criado</p>
              {protocol.dataConclusao && (
                <p className="text-xs text-muted-foreground">{protocol.dataConclusao} - Protocolo concluído</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
