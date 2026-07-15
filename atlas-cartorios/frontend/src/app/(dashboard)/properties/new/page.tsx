'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const propertySchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  area: z.string().optional(),
  proprietario: z.string().optional(),
  valorVenal: z.string().optional(),
  inscricaoImobiliaria: z.string().optional(),
  registro: z.string().optional(),
  observacoes: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function NewPropertyPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  function onSubmit(data: PropertyFormData) {
    console.log('Saving property:', data);
    toast.success('Imóvel cadastrado com sucesso!');
    router.push('/properties');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/properties">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Imóvel</h1>
          <p className="text-sm text-muted-foreground">Cadastre um novo imóvel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle className="text-base">Dados do Imóvel</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Imóvel *</Label>
                <Input id="nome" {...register('nome')} />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input id="matricula" {...register('matricula')} />
                {errors.matricula && <p className="text-xs text-destructive">{errors.matricula.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <select id="tipo" {...register('tipo')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Selecione...</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Sala Comercial">Sala Comercial</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Galpão">Galpão</option>
                  <option value="Prédio">Prédio</option>
                  <option value="Fazenda">Fazenda</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietario">Proprietário</Label>
                <Input id="proprietario" {...register('proprietario')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input id="area" type="number" {...register('area')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorVenal">Valor Venal (R$)</Label>
                <Input id="valorVenal" type="number" step="0.01" {...register('valorVenal')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricaoImobiliaria">Inscrição Imobiliária</Label>
                <Input id="inscricaoImobiliaria" {...register('inscricaoImobiliaria')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registro">Registro</Label>
                <Input id="registro" {...register('registro')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register('cep')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" {...register('endereco')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" {...register('bairro')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" {...register('cidade')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" {...register('estado')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" {...register('observacoes')} />
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/properties"><Button variant="outline" type="button">Cancelar</Button></Link>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
