'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { protocols } from '@/lib/mock/protocols';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 8;
const statusColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'destructive'> = {
  ABERTO: 'default',
  EM_ANDAMENTO: 'info',
  AGUARDANDO_DOCUMENTOS: 'warning',
  SISCOAF_PENDENTE: 'destructive',
  CONCLUIDO: 'success',
  CANCELADO: 'destructive',
};

function fetchProtocols() {
  return new Promise<typeof protocols>((resolve) => setTimeout(() => resolve(protocols), 300));
}

export default function ProtocolsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['protocols'], queryFn: fetchProtocols });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = (data || []).filter((p) => {
    const matchSearch =
      p.numero.includes(search) ||
      p.cliente.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Protocolos</h1>
          <p className="text-sm text-muted-foreground">Gestão de protocolos e serviços</p>
        </div>
        <Link href="/protocols/new">
          <Button><Plus className="mr-2 h-4 w-4" />Novo Protocolo</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" />
        </Button>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="ABERTO">Aberto</SelectItem>
            <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
            <SelectItem value="AGUARDANDO_DOCUMENTOS">Aguardando Docs</SelectItem>
            <SelectItem value="SISCOAF_PENDENTE">SISCOAF Pendente</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Escrevente</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum protocolo encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.numero}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{p.cliente}</TableCell>
                  <TableCell>{p.tipo}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[p.status] || 'default'}>{p.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{p.data}</TableCell>
                  <TableCell>{formatCurrency(p.valor)}</TableCell>
                  <TableCell>{p.escrevente}</TableCell>
                  <TableCell>
                    <Link href={`/protocols/${p.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {(page - 1) * ITEMS_PER_PAGE + 1} a {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
