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
import { documents } from '@/lib/mock/documents';
import { Search, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, 'success' | 'warning' | 'info' | 'destructive'> = {
  APROVADO: 'success',
  PENDENTE: 'warning',
  AGUARDANDO: 'info',
  REJEITADO: 'destructive',
};

const ITEMS_PER_PAGE = 6;

function fetchDocuments() {
  return new Promise<typeof documents>((resolve) => setTimeout(() => resolve(documents), 300));
}

export default function DocumentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((d) => {
    const matchSearch = d.nome.toLowerCase().includes(search.toLowerCase()) || d.protocolo.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
          <p className="text-sm text-muted-foreground">Gestão de documentos dos protocolos</p>
        </div>
        <Button onClick={() => toast.info('Upload em desenvolvimento')}>
          <Upload className="mr-2 h-4 w-4" />Upload
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar documento..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="APROVADO">Aprovado</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="AGUARDANDO">Aguardando</SelectItem>
            <SelectItem value="REJEITADO">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Protocolo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Upload</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Nenhum documento encontrado</TableCell></TableRow>
            ) : (
              paginated.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{d.nome}</TableCell>
                  <TableCell>{d.protocolo}</TableCell>
                  <TableCell><Badge variant="outline">{d.tipo}</Badge></TableCell>
                  <TableCell>{d.dataUpload}</TableCell>
                  <TableCell>{d.tamanho}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[d.status] || 'default'}>{d.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Download iniciado')}>
                      <Download className="h-4 w-4" />
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
