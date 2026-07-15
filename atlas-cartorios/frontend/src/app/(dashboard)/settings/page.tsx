'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  function handleSave() {
    toast.success('Configurações salvas com sucesso!');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Configurações do sistema</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />Dados da Serventia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cartório</Label>
              <Input defaultValue="1º Ofício de Registro de Imóveis" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input defaultValue="00.000.000/0001-00" />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input defaultValue="Rua Principal, 123 - Centro" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input defaultValue="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input defaultValue="SP" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48"><SelectValue placeholder="Tema" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notificações por email</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-48"><SelectValue placeholder="Frequência" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instantâneo</SelectItem>
                    <SelectItem value="daily">Resumo Diário</SelectItem>
                    <SelectItem value="weekly">Resumo Semanal</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Timeout de sessão (minutos)</Label>
                <Input type="number" defaultValue={30} className="w-32" />
              </div>
              <div className="space-y-2">
                <Label>Máximo de tentativas de login</Label>
                <Input type="number" defaultValue={5} className="w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Salvar Configurações</Button>
      </div>
    </div>
  );
}
