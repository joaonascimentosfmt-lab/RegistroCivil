'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { properties } from '@/lib/mock/properties';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, Pencil, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

function fetchProperties() {
  return new Promise<typeof properties>((resolve) => setTimeout(() => resolve(properties), 300));
}

export default function PropertiesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['properties'], queryFn: fetchProperties });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.matricula.includes(search) ||
    p.cidade.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-sm text-muted-foreground">Cadastro de imóveis e matrículas</p>
        </div>
        <Link href="/properties/new">
          <Button><Plus className="mr-2 h-4 w-4" />Novo Imóvel</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, matrícula ou cidade..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Valor Venal</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum imóvel encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>{p.matricula}</TableCell>
                  <TableCell><Badge variant="outline">{p.tipo}</Badge></TableCell>
                  <TableCell className="max-w-[150px] truncate">{p.proprietario}</TableCell>
                  <TableCell>{p.cidade}</TableCell>
                  <TableCell>{p.area} m²</TableCell>
                  <TableCell>{formatCurrency(p.valorVenal)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link href={`/properties/${p.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/properties/${p.id}?edit=true`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => toast.success('Imóvel removido')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
