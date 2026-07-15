'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { users } from '@/lib/mock/users';
import { Search, Plus, Pencil, ChevronLeft, ChevronRight, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;
const roleColors: Record<string, 'default' | 'destructive' | 'info' | 'secondary'> = {
  ADMIN: 'destructive',
  TABELIAO: 'default',
  ESCREVENTE: 'info',
  ASSISTENTE: 'secondary',
};

function fetchUsers() {
  return new Promise<typeof users>((resolve) => setTimeout(() => resolve(users), 300));
}

export default function UsersPage() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = (data || []).filter((u) => u.nome.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de usuários do sistema</p>
        </div>
        <Button onClick={() => toast.info('Cadastro em desenvolvimento')}>
          <Plus className="mr-2 h-4 w-4" />Novo Usuário
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar usuário..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : paginated.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Nenhum usuário encontrado</TableCell></TableRow>
            ) : (
              paginated.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {u.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleColors[u.role] || 'default'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {u.ativo ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600"><UserCheck className="h-3 w-3" />Ativo</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Inativo</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{u.ultimoAcesso}</TableCell>
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
