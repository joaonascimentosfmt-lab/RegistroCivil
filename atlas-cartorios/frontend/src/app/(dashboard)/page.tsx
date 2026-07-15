'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  HorizontalBar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  dashboardStats,
  monthlyData,
  topServices,
  recentProtocols,
  escreventePerformance,
} from '@/lib/mock/dashboard';

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'info' | 'destructive'> = {
  CONCLUIDO: 'success',
  EM_ANDAMENTO: 'info',
  AGUARDANDO_DOCUMENTOS: 'warning',
  ABERTO: 'default',
};

const statusLabel: Record<string, string> = {
  CONCLUIDO: 'Concluído',
  EM_ANDAMENTO: 'Em Andamento',
  AGUARDANDO_DOCUMENTOS: 'Aguardando Docs',
  ABERTO: 'Aberto',
};

function fetchStats() {
  return new Promise<typeof dashboardStats>((resolve) =>
    setTimeout(() => resolve(dashboardStats), 300)
  );
}

function fetchMonthly() {
  return new Promise<typeof monthlyData>((resolve) =>
    setTimeout(() => resolve(monthlyData), 300)
  );
}

function fetchTopServices() {
  return new Promise<typeof topServices>((resolve) =>
    setTimeout(() => resolve(topServices), 300)
  );
}

function fetchRecentProtocols() {
  return new Promise<typeof recentProtocols>((resolve) =>
    setTimeout(() => resolve(recentProtocols), 300)
  );
}

function fetchEscreventes() {
  return new Promise<typeof escreventePerformance>((resolve) =>
    setTimeout(() => resolve(escreventePerformance), 300)
  );
}

const statsCards = [
  { key: 'totalProtocolos', label: 'Total Protocolos', icon: FileText, value: 0, trend: '+12%', trendUp: true, color: 'text-blue-600' },
  { key: 'emAndamento', label: 'Em Andamento', icon: Clock, value: 0, trend: '+3%', trendUp: true, color: 'text-amber-600' },
  { key: 'concluidos', label: 'Concluídos', icon: CheckCircle2, value: 0, trend: '+8%', trendUp: true, color: 'text-emerald-600' },
  { key: 'aguardandoDocs', label: 'Aguardando Docs', icon: AlertCircle, value: 0, trend: '-5%', trendUp: false, color: 'text-orange-600' },
  { key: 'coafPendentes', label: 'COAF Pendentes', icon: ShieldAlert, value: 0, trend: '+1', trendUp: true, color: 'text-red-600' },
];

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: fetchStats });
  const { data: monthly } = useQuery({ queryKey: ['dashboard-monthly'], queryFn: fetchMonthly });
  const { data: services } = useQuery({ queryKey: ['dashboard-services'], queryFn: fetchTopServices });
  const { data: protocols } = useQuery({ queryKey: ['dashboard-protocols'], queryFn: fetchRecentProtocols });
  const { data: escreventes } = useQuery({ queryKey: ['dashboard-escreventes'], queryFn: fetchEscreventes });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do cartório</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const currentValue = stats?.[card.key as keyof typeof stats] ?? 0;
          return (
            <Card key={card.key} className="animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold">{currentValue}</p>
                  </div>
                  <div className={`rounded-full bg-muted p-2 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {card.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={card.trendUp ? 'text-emerald-600' : 'text-red-600'}>
                    {card.trend}
                  </span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Movimento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Serviços mais Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={services} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={140} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Protocolos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.numero}</TableCell>
                    <TableCell>{p.cliente}</TableCell>
                    <TableCell>{p.tipo}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[p.status] || 'default'}>
                        {statusLabel[p.status] || p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Atendimentos por Escrevente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={escreventes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="atendimentos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
