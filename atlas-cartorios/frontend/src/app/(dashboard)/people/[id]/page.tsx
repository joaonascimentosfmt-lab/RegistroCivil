'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Pencil } from 'lucide-react';
import Link from 'next/link';
import { people } from '@/lib/mock/people';
import { toast } from 'sonner';

function fetchPerson(id: string) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(people.find((p) => p.id === id)), 300)
  );
}

export default function PersonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = searchParams.get('edit') === 'true';
  const [isEdit, setIsEdit] = useState(isEditing);

  const { data: person, isLoading } = useQuery({
    queryKey: ['person', params.id],
    queryFn: () => fetchPerson(params.id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <p className="text-lg font-medium">Pessoa não encontrada</p>
        <Link href="/people">
          <Button variant="outline">Voltar para lista</Button>
        </Link>
      </div>
    );
  }

  function handleSave() {
    toast.success('Dados atualizados com sucesso!');
    setIsEdit(false);
    router.push('/people');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/people">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{person.nome}</h1>
            <p className="text-sm text-muted-foreground">
              <Badge variant={person.tipo === 'PF' ? 'info' : 'default'} className="mr-2">{person.tipo}</Badge>
              {person.cpfCnpj}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
          <Pencil className="mr-2 h-4 w-4" />
          {isEdit ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {isEdit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editar Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input defaultValue={person.nome} />
              </div>
              <div className="space-y-2">
                <Label>CPF/CNPJ</Label>
                <Input defaultValue={person.cpfCnpj} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input defaultValue={person.telefone} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={person.email} />
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input defaultValue={person.cep} />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input defaultValue={person.endereco} />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input defaultValue={person.cidade} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input defaultValue={person.estado} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea defaultValue={person.observacoes} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEdit(false)}>Cancelar</Button>
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Salvar</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {person.tipo === 'PF' && (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">CPF:</span>
                    <span className="font-medium">{person.cpfCnpj}</span>
                    <span className="text-muted-foreground">RG:</span>
                    <span className="font-medium">{person.rg || '-'}</span>
                    <span className="text-muted-foreground">Estado Civil:</span>
                    <span className="font-medium">{person.estadoCivil || '-'}</span>
                    <span className="text-muted-foreground">Profissão:</span>
                    <span className="font-medium">{person.profissao || '-'}</span>
                    <span className="text-muted-foreground">Nacionalidade:</span>
                    <span className="font-medium">{person.nacionalidade || '-'}</span>
                    <span className="text-muted-foreground">Data Nasc.:</span>
                    <span className="font-medium">{person.dataNascimento || '-'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contato e Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Telefone:</span>
                <span className="font-medium">{person.telefone}</span>
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{person.email}</span>
                <span className="text-muted-foreground">CEP:</span>
                <span className="font-medium">{person.cep}</span>
                <span className="text-muted-foreground">Endereço:</span>
                <span className="font-medium">{person.endereco}</span>
                <span className="text-muted-foreground">Cidade:</span>
                <span className="font-medium">{person.cidade}</span>
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium">{person.estado}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
