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
import { properties } from '@/lib/mock/properties';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

function fetchProperty(id: string) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(properties.find((p) => p.id === id)), 300)
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(searchParams.get('edit') === 'true');

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', params.id],
    queryFn: () => fetchProperty(params.id as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <p className="text-lg font-medium">Imóvel não encontrado</p>
        <Link href="/properties"><Button variant="outline">Voltar para lista</Button></Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/properties">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{property.nome}</h1>
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">{property.tipo}</Badge>
              Matrícula {property.matricula}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
          <Pencil className="mr-2 h-4 w-4" />{isEdit ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {isEdit ? (
        <Card>
          <CardHeader><CardTitle className="text-base">Editar Imóvel</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input defaultValue={property.nome} />
              </div>
              <div className="space-y-2">
                <Label>Matrícula</Label>
                <Input defaultValue={property.matricula} />
              </div>
              <div className="space-y-2">
                <Label>Proprietário</Label>
                <Input defaultValue={property.proprietario} />
              </div>
              <div className="space-y-2">
                <Label>Valor Venal</Label>
                <Input defaultValue={String(property.valorVenal)} />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input defaultValue={property.endereco} />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input defaultValue={property.cidade} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEdit(false)}>Cancelar</Button>
              <Button onClick={() => { toast.success('Imóvel atualizado!'); setIsEdit(false); }}>
                <Save className="mr-2 h-4 w-4" />Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Informações do Imóvel</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Matrícula:</span><span className="font-medium">{property.matricula}</span>
                <span className="text-muted-foreground">Tipo:</span><span className="font-medium">{property.tipo}</span>
                <span className="text-muted-foreground">Área:</span><span className="font-medium">{property.area} m²</span>
                <span className="text-muted-foreground">Valor Venal:</span><span className="font-medium">{formatCurrency(property.valorVenal)}</span>
                <span className="text-muted-foreground">Inscrição:</span><span className="font-medium">{property.inscricaoImobiliaria || '-'}</span>
                <span className="text-muted-foreground">Registro:</span><span className="font-medium">{property.registro || '-'}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Localização</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Endereço:</span><span className="font-medium">{property.endereco}</span>
                <span className="text-muted-foreground">Bairro:</span><span className="font-medium">{property.bairro}</span>
                <span className="text-muted-foreground">Cidade:</span><span className="font-medium">{property.cidade}</span>
                <span className="text-muted-foreground">Estado:</span><span className="font-medium">{property.estado}</span>
                <span className="text-muted-foreground">CEP:</span><span className="font-medium">{property.cep}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Proprietário</CardTitle></CardHeader>
            <CardContent>
              <p className="font-medium">{property.proprietario}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
