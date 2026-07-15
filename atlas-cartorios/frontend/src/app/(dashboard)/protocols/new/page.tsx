'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ChevronRight, ChevronLeft, Check, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const steps = [
  { id: 1, label: 'Tipo do Ato' },
  { id: 2, label: 'Partes' },
  { id: 3, label: 'Imóveis' },
  { id: 4, label: 'Documentos' },
  { id: 5, label: 'Análise SISCOAF' },
  { id: 6, label: 'Pendências' },
  { id: 7, label: 'Resumo' },
  { id: 8, label: 'Finalização' },
];

const serviceTypes = [
  'Compra e Venda',
  'Procuração',
  'Autenticação',
  'Reconhecimento de Firma',
  'Divórcio',
  'Inventário',
  'Escritura',
  'Testamento',
  'Alteração Contratual',
  'Certidão',
];

const documentChecklist: Record<string, string[]> = {
  'Compra e Venda': ['RG Vendedor', 'CPF Vendedor', 'RG Comprador', 'CPF Comprador', 'Certidão de Casamento', 'Matrícula do Imóvel', 'Certidão de Ônus', 'IPTU'],
  'Procuração': ['RG Outorgante', 'CPF Outorgante', 'RG Outorgado', 'CPF Outorgado'],
  'Divórcio': ['RG Cônjuge 1', 'RG Cônjuge 2', 'Certidão de Casamento', 'Certidão de Nascimento dos Filhos', 'Acordo de Divórcio'],
  'Inventário': ['RG Falecido', 'Certidão de Óbito', 'Certidão de Casamento', 'Relação de Bens', 'Documentos dos Imóveis'],
};

export default function NewProtocolPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [partes, setPartes] = useState<string[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [siscoafApproved, setSiscoafApproved] = useState(false);
  const [pendencias, setPendencias] = useState('');

  function handleNext() {
    if (currentStep === 1 && !selectedService) {
      toast.error('Selecione um tipo de ato');
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleFinish() {
    toast.success('Protocolo criado com sucesso!');
    router.push('/protocols');
  }

  const currentDocs = documentChecklist[selectedService] || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/protocols">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Protocolo</h1>
          <p className="text-sm text-muted-foreground">Passo {currentStep} de {steps.length}: {steps.find((s) => s.id === currentStep)?.label}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              step.id === currentStep
                ? 'bg-primary text-primary-foreground'
                : step.id < currentStep
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => {
              if (step.id < currentStep) setCurrentStep(step.id);
            }}
          >
            {step.id < currentStep ? <Check className="h-3 w-3" /> : <span>{step.id}</span>}
            {step.label}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{steps.find((s) => s.id === currentStep)?.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {serviceTypes.map((svc) => (
                <Button
                  key={svc}
                  type="button"
                  variant={selectedService === svc ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setSelectedService(svc)}
                >
                  {selectedService === svc && <Check className="mr-2 h-4 w-4" />}
                  {svc}
                </Button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Adicione as partes envolvidas no ato.</p>
              <div className="flex gap-2">
                <Input placeholder="Buscar pessoa..." className="max-w-sm" />
                <Button variant="outline">Adicionar</Button>
              </div>
              {partes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma parte adicionada ainda.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {partes.map((p, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {p}
                      <button onClick={() => setPartes(partes.filter((_, j) => j !== i))}>x</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Vincule imóveis relacionados ao ato.</p>
              <div className="flex gap-2">
                <Input placeholder="Buscar imóvel por matrícula..." className="max-w-sm" />
                <Button variant="outline">Adicionar</Button>
              </div>
              <p className="text-sm text-muted-foreground">Nenhum imóvel adicionado.</p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Checklist de documentos para {selectedService || 'o ato selecionado'}:</p>
              {currentDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Selecione um tipo de ato na etapa 1.</p>
              ) : (
                <div className="space-y-2">
                  {currentDocs.map((doc) => (
                    <label key={doc} className="flex items-center gap-3 rounded-md border p-3 text-sm cursor-pointer hover:bg-muted/50">
                      <Checkbox
                        checked={checkedDocs.includes(doc)}
                        onCheckedChange={() => {
                          setCheckedDocs((prev) =>
                            prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
                          );
                        }}
                      />
                      {doc}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Análise de conformidade SISCOAF.</p>
              <div className="rounded-md border bg-muted/30 p-4">
                <p className="mb-2 text-sm font-medium">Indicadores acionados:</p>
                <p className="text-sm text-muted-foreground">Nenhum indicador acionado para esta operação.</p>
              </div>
              <label className="flex items-center gap-3 rounded-md border p-3 text-sm cursor-pointer hover:bg-muted/50">
                <Checkbox
                  checked={siscoafApproved}
                  onCheckedChange={(c) => setSiscoafApproved(c as boolean)}
                />
                Análise SISCOAF concluída - operação em conformidade
              </label>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Registre pendências ou observações sobre este protocolo.</p>
              <Textarea
                placeholder="Descreva pendências ou observações..."
                value={pendencias}
                onChange={(e) => setPendencias(e.target.value)}
              />
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <p className="text-sm font-medium">Resumo do Protocolo</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Tipo do Ato:</span><span className="font-medium">{selectedService || 'Não selecionado'}</span>
                <span className="text-muted-foreground">Partes:</span><span className="font-medium">{partes.length || 0}</span>
                <span className="text-muted-foreground">Documentos:</span><span className="font-medium">{checkedDocs.length} de {currentDocs.length}</span>
                <span className="text-muted-foreground">SISCOAF:</span><span className="font-medium">{siscoafApproved ? 'Aprovado' : 'Pendente'}</span>
                <span className="text-muted-foreground">Pendências:</span><span className="font-medium">{pendencias ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-8 w-8" />
                </div>
              </div>
              <p className="text-lg font-medium">Protocolo pronto para finalização</p>
              <p className="text-sm text-muted-foreground">Revise os dados e confirme a criação do protocolo.</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />Anterior
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Próximo<ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                <Save className="mr-2 h-4 w-4" />Finalizar Protocolo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
