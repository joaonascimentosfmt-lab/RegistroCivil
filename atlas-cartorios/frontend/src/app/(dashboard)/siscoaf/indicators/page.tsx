'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siscoafIndicators } from '@/lib/mock/siscoaf';
import { Plus, Pencil, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

function fetchIndicators() {
  return new Promise<typeof siscoafIndicators>((resolve) => setTimeout(() => resolve(siscoafIndicators), 300));
}

export default function SiscoafIndicatorsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['siscoaf-indicators'], queryFn: fetchIndicators });
  const [search, setSearch] = useState('');

  const filtered = (data || []).filter((i) =>
    i.nome.toLowerCase().includes(search.toLowerCase()) ||
    i.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Indicadores SISCOAF</h1>
          <p className="text-sm text-muted-foreground">Gerenciar indicadores de monitoramento</p>
        </div>
        <Button onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
          <Plus className="mr-2 h-4 w-4" />Novo Indicador
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar indicador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Limiar (R$)</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Nenhum indicador encontrado</TableCell></TableRow>
            ) : (
              filtered.map((ind) => (
                <TableRow key={ind.id}>
                  <TableCell className="font-medium">{ind.codigo}</TableCell>
                  <TableCell className="max-w-[240px] truncate" title={ind.descricao}>{ind.nome}</TableCell>
                  <TableCell>
                    <Badge variant={ind.tipo === 'OBRIGATORIO' ? 'destructive' : 'warning'}>
                      {ind.tipo === 'OBRIGATORIO' ? 'Obrigatório' : 'Comportamental'}
                    </Badge>
                  </TableCell>
                  <TableCell>{ind.limiar > 0 ? `R$ ${ind.limiar.toLocaleString()}` : 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toast.success(`Indicador ${ind.ativo ? 'desativado' : 'ativado'}`)}
                    >
                      {ind.ativo ? <ToggleRight className="h-5 w-5 text-emerald-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
