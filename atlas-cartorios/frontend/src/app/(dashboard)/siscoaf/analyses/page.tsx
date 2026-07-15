'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { siscoafAnalyses } from '@/lib/mock/siscoaf';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

function fetchAnalyses() {
  return new Promise<typeof siscoafAnalyses>((resolve) => setTimeout(() => resolve(siscoafAnalyses), 300));
}

export default function SiscoafAnalysesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['siscoaf-analyses-list'], queryFn: fetchAnalyses });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((a) => {
    const matchSearch = a.protocolo.includes(search) || a.cliente.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchRisk = riskFilter === 'all' || a.nivelRisco === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Análises SISCOAF</h1>
        <p className="text-sm text-muted-foreground">Lista de análises de conformidade</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por protocolo ou cliente..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="CONCLUIDA">Concluída</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Risco" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ALTO">Alto</SelectItem>
            <SelectItem value="MÉDIO">Médio</SelectItem>
            <SelectItem value="BAIXO">Baixo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protocolo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Indicador</TableHead>
              <TableHead>Risco</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">Nenhuma análise encontrada</TableCell></TableRow>
            ) : (
              paginated.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.protocolo}</TableCell>
                  <TableCell>{a.cliente}</TableCell>
                  <TableCell>R$ {a.valor.toLocaleString()}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{a.indicador}</TableCell>
                  <TableCell>
                    <Badge variant={a.nivelRisco === 'ALTO' ? 'destructive' : a.nivelRisco === 'MÉDIO' ? 'warning' : 'success'}>
                      {a.nivelRisco}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.status.replace('_', ' ')}</TableCell>
                  <TableCell>{a.responsavel}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} a {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
