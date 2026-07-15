export const protocolStatuses = ['ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO_DOCUMENTOS', 'SISCOAF_PENDENTE', 'CONCLUIDO', 'CANCELADO'] as const;
export type ProtocolStatus = typeof protocolStatuses[number];

export const protocols = [
  { id: '1', numero: '2024/0001', cliente: 'João Silva', tipo: 'Compra e Venda', status: 'CONCLUIDO' as ProtocolStatus, data: '2024-01-15', valor: 350000, escrevente: 'Carlos', dataConclusao: '2024-02-10', observacoes: '' },
  { id: '2', numero: '2024/0002', cliente: 'Maria Oliveira', tipo: 'Procuração', status: 'EM_ANDAMENTO' as ProtocolStatus, data: '2024-01-14', valor: 200, escrevente: 'Ana', dataConclusao: '', observacoes: 'Aguardando assinatura' },
  { id: '3', numero: '2024/0003', cliente: 'Carlos Santos', tipo: 'Autenticação', status: 'CONCLUIDO' as ProtocolStatus, data: '2024-01-14', valor: 50, escrevente: 'Roberto', dataConclusao: '2024-01-14', observacoes: '' },
  { id: '4', numero: '2024/0004', cliente: 'Ana Costa', tipo: 'Divórcio', status: 'AGUARDANDO_DOCUMENTOS' as ProtocolStatus, data: '2024-01-13', valor: 1500, escrevente: 'Juliana', dataConclusao: '', observacoes: 'Aguardando certidão de casamento' },
  { id: '5', numero: '2024/0005', cliente: 'Pedro Almeida', tipo: 'Inventário', status: 'ABERTO' as ProtocolStatus, data: '2024-01-12', valor: 5000, escrevente: 'Marcos', dataConclusao: '', observacoes: '' },
  { id: '6', numero: '2024/0006', cliente: 'Tech Solutions Ltda', tipo: 'Alteração Contratual', status: 'SISCOAF_PENDENTE' as ProtocolStatus, data: '2024-01-11', valor: 800, escrevente: 'Carlos', dataConclusao: '', observacoes: 'Análise COAF necessária' },
  { id: '7', numero: '2024/0007', cliente: 'Fernanda Lima', tipo: 'Escritura', status: 'CONCLUIDO' as ProtocolStatus, data: '2024-01-10', valor: 250000, escrevente: 'Ana', dataConclusao: '2024-02-05', observacoes: '' },
  { id: '8', numero: '2024/0008', cliente: 'Roberto Gomes', tipo: 'Reconhecimento de Firma', status: 'CONCLUIDO' as ProtocolStatus, data: '2024-01-09', valor: 30, escrevente: 'Roberto', dataConclusao: '2024-01-09', observacoes: '' },
  { id: '9', numero: '2024/0009', cliente: 'Lucia Mendes', tipo: 'Testamento', status: 'EM_ANDAMENTO' as ProtocolStatus, data: '2024-01-08', valor: 2000, escrevente: 'Juliana', dataConclusao: '', observacoes: 'Documentação em análise' },
  { id: '10', numero: '2024/0010', cliente: 'Construtora Nova Ltda', tipo: 'Compra e Venda', status: 'AGUARDANDO_DOCUMENTOS' as ProtocolStatus, data: '2024-01-07', valor: 1200000, escrevente: 'Marcos', dataConclusao: '', observacoes: 'Aguardando matrícula atualizada' },
];
