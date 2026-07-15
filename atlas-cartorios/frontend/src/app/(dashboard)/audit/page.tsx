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
import { auditLogs } from '@/lib/mock/audit';
import { Search, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

function fetchLogs() {
  return new Promise<typeof auditLogs>((resolve) => setTimeout(() => resolve(auditLogs), 300));
}

export default function AuditPage() {
  const { data, isLoading } = useQuery({ queryKey: ['audit-logs'], queryFn: fetchLogs });
  const [search, setSearch] = useState('');
  const [acaoFilter, setAcaoFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((l) => {
    const matchSearch = l.usuario.toLowerCase().includes(search.toLowerCase()) || l.descricao.toLowerCase().includes(search.toLowerCase());
    const matchAcao = acaoFilter === 'all' || l.acao === acaoFilter;
    return matchSearch && matchAcao;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-sm text-muted-foreground">Registro de atividades do sistema</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar logs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={acaoFilter} onValueChange={(v) => { setAcaoFilter(v); setPage(1); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Ação" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Ações</SelectItem>
            <SelectItem value="CRIAR_PROTOCOLO">Criar Protocolo</SelectItem>
            <SelectItem value="ATUALIZAR_PESSOA">Atualizar Pessoa</SelectItem>
            <SelectItem value="EXCLUIR_DOCUMENTO">Excluir Documento</SelectItem>
            <SelectItem value="CONCLUIR_PROTOCOLO">Concluir Protocolo</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
            <SelectItem value="ANEXAR_DOCUMENTO">Anexar Documento</SelectItem>
            <SelectItem value="SISCOAF_ANALISE">Análise SISCOAF</SelectItem>
            <SelectItem value="CRIAR_USUARIO">Criar Usuário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Data/Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Nenhum registro encontrado</TableCell></TableRow>
            ) : (
              paginated.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.usuario}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{log.acao.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.descricao}</TableCell>
                  <TableCell>{log.entidade}</TableCell>
                  <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                  <TableCell className="text-xs">{log.data}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filtered.length} registro(s)</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium">{page} / {totalPages || 1}</span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
