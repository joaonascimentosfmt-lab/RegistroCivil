'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { financeSummary, monthlyFinance, recentTransactions } from '@/lib/mock/finance';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';

function fetchSummary() {
  return new Promise<typeof financeSummary>((resolve) => setTimeout(() => resolve(financeSummary), 300));
}

function fetchMonthly() {
  return new Promise<typeof monthlyFinance>((resolve) => setTimeout(() => resolve(monthlyFinance), 300));
}

export default function FinancePage() {
  const { data: summary } = useQuery({ queryKey: ['finance-summary'], queryFn: fetchSummary });
  const { data: monthly } = useQuery({ queryKey: ['finance-monthly'], queryFn: fetchMonthly });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Visão geral financeira do cartório</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Receita Total</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(summary?.receitaTotal || 0)}</p>
              </div>
              <DollarSign className="h-6 w-6 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Despesa Total</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(summary?.despesaTotal || 0)}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(summary?.saldo || 0)}</p>
              </div>
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">A Receber</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(summary?.recebimentosPendentes || 0)}</p>
              </div>
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Receita vs Despesa Mensal</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="receita" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Receita" />
                  <Bar dataKey="despesa" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Resumo do Mês</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Receita do Mês</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(summary?.receitaMes || 0)}</p>
                <span className="flex items-center gap-1 text-xs text-emerald-600"><TrendingUp className="h-3 w-3" />+5.2%</span>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Despesa do Mês</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(summary?.despesaMes || 0)}</p>
                <span className="flex items-center gap-1 text-xs text-red-600"><TrendingUp className="h-3 w-3" />+2.1%</span>
              </div>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Saldo do Mês</p>
              <p className="text-lg font-bold">{formatCurrency(summary?.saldoMes || 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Transações Recentes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Forma Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.descricao}</TableCell>
                  <TableCell>
                    <Badge variant={t.tipo === 'RECEITA' ? 'success' : 'destructive'}>
                      {t.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell className={t.tipo === 'RECEITA' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {t.tipo === 'RECEITA' ? '+' : '-'}{formatCurrency(t.valor)}
                  </TableCell>
                  <TableCell>{t.data}</TableCell>
                  <TableCell>{t.formaPagamento}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
