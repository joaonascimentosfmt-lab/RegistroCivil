'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3, Download, FileText, Calendar, Filter,
} from 'lucide-react';
import { toast } from 'sonner';

const reportTypes = [
  { id: 'protocolos', label: 'Protocolos por Período', icon: FileText },
  { id: 'financeiro', label: 'Relatório Financeiro', icon: BarChart3 },
  { id: 'produtividade', label: 'Produtividade por Escrevente', icon: BarChart3 },
  { id: 'siscoaf', label: 'Relatório SISCOAF', icon: BarChart3 },
  { id: 'atendimento', label: 'Atendimentos Realizados', icon: BarChart3 },
  { id: 'certidoes', label: 'Certidões Emitidas', icon: FileText },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function handleGenerate() {
    if (!selectedReport) {
      toast.error('Selecione um tipo de relatório');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Selecione o período');
      return;
    }
    toast.success('Relatório gerado com sucesso!');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Geração de relatórios gerenciais</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Novo Relatório</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tipo de Relatório</Label>
                <div className="grid grid-cols-2 gap-3">
                  {reportTypes.map((r) => {
                    const Icon = r.icon;
                    return (
                      <Button
                        key={r.id}
                        variant={selectedReport === r.id ? 'default' : 'outline'}
                        className="justify-start h-auto py-3"
                        onClick={() => setSelectedReport(r.id)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {r.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Início</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Fim</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Formato</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate}>
                <Download className="mr-2 h-4 w-4" />Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Relatórios Recentes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">Relatório Financeiro</p>
                <p className="text-xs text-muted-foreground">01/01/2024 - 31/01/2024</p>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <p className="font-medium">Protocolos por Período</p>
                <p className="text-xs text-muted-foreground">01/01/2024 - 31/12/2024</p>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">Nenhum relatório recente</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
