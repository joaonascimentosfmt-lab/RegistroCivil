export const siscoafIndicators = [
  { id: '1', codigo: 'IND-001', nome: 'Operações em Espécie', descricao: 'Operações envolvendo valores em espécie acima de R$ 50.000', tipo: 'OBRIGATORIO', limiar: 50000, ativo: true },
  { id: '2', codigo: 'IND-002', nome: 'Partes PEP', descricao: 'Pessoa Exposta Politicamente (PEP)', tipo: 'OBRIGATORIO', limiar: 0, ativo: true },
  { id: '3', codigo: 'IND-003', nome: 'Múltiplos Envolvimentos', descricao: 'Parte envolvida em mais de 5 operações no mês', tipo: 'COMPORTAMENTAL', limiar: 5, ativo: true },
  { id: '4', codigo: 'IND-004', nome: 'Incompatibilidade Patrimonial', descricao: 'Valor da operação incompatível com a renda declarada', tipo: 'COMPORTAMENTAL', limiar: 0, ativo: true },
  { id: '5', codigo: 'IND-005', nome: 'Origem de Recursos', descricao: 'Recursos oriundos de países com deficiências na LBC', tipo: 'OBRIGATORIO', limiar: 0, ativo: false },
  { id: '6', codigo: 'IND-006', nome: 'Operações Fracionadas', descricao: 'Conjunto de operações que somadas ultrapassam o limiar', tipo: 'COMPORTAMENTAL', limiar: 30000, ativo: true },
];

export const siscoafAnalyses = [
  { id: '1', protocolo: '2024/0006', cliente: 'Tech Solutions Ltda', valor: 800, indicador: 'Partes PEP', nivelRisco: 'ALTO', status: 'EM_ANALISE', dataAbertura: '2024-01-11', responsavel: 'Carlos', dataConclusao: '', observacoes: 'Sócio aparece em lista PEP' },
  { id: '2', protocolo: '2024/0004', cliente: 'Ana Costa', valor: 1500, indicador: 'Múltiplos Envolvimentos', nivelRisco: 'MÉDIO', status: 'PENDENTE', dataAbertura: '2024-01-13', responsavel: 'Ana', dataConclusao: '', observacoes: '' },
  { id: '3', protocolo: '2024/0010', cliente: 'Construtora Nova Ltda', valor: 1200000, indicador: 'Operações em Espécie', nivelRisco: 'ALTO', status: 'CONCLUIDA', dataAbertura: '2024-01-07', responsavel: 'Carlos', dataConclusao: '2024-01-20', observacoes: 'Operação justificada - venda de imóvel de alto padrão' },
  { id: '4', protocolo: '2024/0001', cliente: 'João Silva', valor: 350000, indicador: 'Incompatibilidade Patrimonial', nivelRisco: 'BAIXO', status: 'CONCLUIDA', dataAbertura: '2024-01-15', responsavel: 'Roberto', dataConclusao: '2024-01-25', observacoes: 'Renda compatível com a operação' },
];

export const decisionTreeNodes = {
  id: 'root',
  label: 'Iniciar Análise SISCOAF',
  type: 'question',
  children: [
    {
      id: 'q1-sim',
      label: 'Valor acima de R$ 50.000?',
      type: 'question',
      children: [
        {
          id: 'q1-sim-sim',
          label: 'Parte é PEP?',
          type: 'question',
          children: [
            { id: 'q1-sim-sim-sim', label: 'Comunicar ao COAF urgentemente', type: 'action' },
            { id: 'q1-sim-sim-nao', label: 'Coletar documentação complementar', type: 'action' },
          ],
        },
        { id: 'q1-sim-nao', label: 'Verificar origem dos recursos', type: 'action' },
      ],
    },
    {
      id: 'q1-nao',
      label: 'Parte tem múltiplas operações?',
      type: 'question',
      children: [
        { id: 'q1-nao-sim', label: 'Avaliar fracionamento de operações', type: 'action' },
        { id: 'q1-nao-nao', label: 'Operação dentro da normalidade', type: 'action' },
      ],
    },
  ],
};
