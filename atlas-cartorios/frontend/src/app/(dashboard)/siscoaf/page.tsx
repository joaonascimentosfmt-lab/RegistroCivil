'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { siscoafIndicators, siscoafAnalyses } from '@/lib/mock/siscoaf';
import { ShieldAlert, AlertTriangle, CheckCircle2, ListChecks, GitBranch, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

function fetchStats() {
  return new Promise((resolve) =>
    setTimeout(() => resolve({
      totalIndicadores: siscoafIndicators.filter((i) => i.ativo).length,
      analisesPendentes: siscoafAnalyses.filter((a) => a.status !== 'CONCLUIDA').length,
      analisesAltoRisco: siscoafAnalyses.filter((a) => a.nivelRisco === 'ALTO').length,
      analisesConcluidas: siscoafAnalyses.filter((a) => a.status === 'CONCLUIDA').length,
    }), 200)
  );
}

function fetchAnalyses() {
  return new Promise<typeof siscoafAnalyses>((resolve) => setTimeout(() => resolve(siscoafAnalyses), 300));
}

export default function SiscoafPage() {
  const { data: stats } = useQuery({ queryKey: ['siscoaf-stats'], queryFn: fetchStats });
  const { data: analyses } = useQuery({ queryKey: ['siscoaf-analyses'], queryFn: fetchAnalyses });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SISCOAF</h1>
        <p className="text-sm text-muted-foreground">Sistema de Controle de Atividades Financeiras - COAF</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Indicadores</p>
                <p className="text-2xl font-bold">{stats?.totalIndicadores || 0}</p>
              </div>
              <ListChecks className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Análises Pendentes</p>
                <p className="text-2xl font-bold">{stats?.analisesPendentes || 0}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Alto Risco</p>
                <p className="text-2xl font-bold">{stats?.analisesAltoRisco || 0}</p>
              </div>
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{stats?.analisesConcluidas || 0}</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/siscoaf/indicators">
          <Button variant="outline"><ListChecks className="mr-2 h-4 w-4" />Indicadores</Button>
        </Link>
        <Link href="/siscoaf/analyses">
          <Button variant="outline"><ShieldAlert className="mr-2 h-4 w-4" />Análises</Button>
        </Link>
        <Link href="/siscoaf/decision-tree">
          <Button variant="outline"><GitBranch className="mr-2 h-4 w-4" />Árvore de Decisão</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análises Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Abertura</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(analyses || []).map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.protocolo}</TableCell>
                  <TableCell>{a.cliente}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{a.indicador}</TableCell>
                  <TableCell>
                    <Badge variant={a.nivelRisco === 'ALTO' ? 'destructive' : a.nivelRisco === 'MÉDIO' ? 'warning' : 'success'}>
                      {a.nivelRisco}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.status.replace('_', ' ')}</TableCell>
                  <TableCell>{a.dataAbertura}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
