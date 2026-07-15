'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roles } from '@/lib/mock/users';
import { Shield, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';

function fetchRoles() {
  return new Promise<typeof roles>((resolve) => setTimeout(() => resolve(roles), 300));
}

export default function RolesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['roles'], queryFn: fetchRoles });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Permissões</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento de perfis e permissões de acesso</p>
        </div>
        <Button onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
          <Plus className="mr-2 h-4 w-4" />Nova Permissão
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Perfis de Acesso</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead className="w-16">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="h-20 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
                  ) : (
                    (data || []).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">{r.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-sm text-muted-foreground">{r.descricao}</TableCell>
                        <TableCell><Badge variant="secondary">{r.usuarios}</Badge></TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle className="text-base">Permissões do Perfil</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Selecione um perfil para visualizar suas permissões.</p>
              {data && data.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">{data[0].nome}</p>
                  <div className="flex flex-wrap gap-2">
                    {data[0].permissoes.map((perm, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
