'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const pfSchema = z.object({
  tipo: z.literal('PF'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().min(11, 'CPF inválido'),
  rg: z.string().optional(),
  cnh: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
  nacionalidade: z.string().optional(),
  dataNascimento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
});

const pjSchema = z.object({
  tipo: z.literal('PJ'),
  razaoSocial: z.string().min(3, 'Razão Social deve ter no mínimo 3 caracteres'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  inscricaoEstadual: z.string().optional(),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  observacoes: z.string().optional(),
});

const schema = z.discriminatedUnion('tipo', [pfSchema, pjSchema]);

type PersonFormData = z.infer<typeof schema>;

export default function NewPersonPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'PF' | 'PJ'>('PF');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonFormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'PF' },
  });

  function onSubmit(data: PersonFormData) {
    console.log('Saving person:', data);
    toast.success('Pessoa cadastrada com sucesso!');
    router.push('/people');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/people">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Pessoa</h1>
          <p className="text-sm text-muted-foreground">Cadastre uma nova pessoa física ou jurídica</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados da Pessoa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={tipo === 'PF' ? 'default' : 'outline'}
                onClick={() => { setTipo('PF'); reset({ tipo: 'PF' }); }}
              >
                Pessoa Física
              </Button>
              <Button
                type="button"
                variant={tipo === 'PJ' ? 'default' : 'outline'}
                onClick={() => { setTipo('PJ'); reset({ tipo: 'PJ' }); }}
              >
                Pessoa Jurídica
              </Button>
            </div>

            {tipo === 'PF' ? (
              <>
                <input type="hidden" {...register('tipo')} value="PF" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input id="nome" {...register('nome')} />
                    {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" {...register('cpf')} />
                    {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" {...register('rg')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnh">CNH</Label>
                    <Input id="cnh" {...register('cnh')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                    <Input id="estadoCivil" {...register('estadoCivil')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profissao">Profissão</Label>
                    <Input id="profissao" {...register('profissao')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nacionalidade">Nacionalidade</Label>
                    <Input id="nacionalidade" {...register('nacionalidade')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input id="dataNascimento" type="date" {...register('dataNascimento')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" {...register('telefone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <input type="hidden" {...register('tipo')} value="PJ" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input id="razaoSocial" {...register('razaoSocial')} />
                    {errors.razaoSocial && <p className="text-xs text-destructive">{errors.razaoSocial.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input id="cnpj" {...register('cnpj')} />
                    {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                    <Input id="inscricaoEstadual" {...register('inscricaoEstadual')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" {...register('telefone')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register('cep')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" {...register('endereco')} />
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
              <Link href="/people">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
