export const auditLogs = [
  { id: '1', usuario: 'Admin', acao: 'CRIAR_PROTOCOLO', descricao: 'Criou protocolo 2024/0011', entidade: 'Protocolo', entidadeId: '11', ip: '192.168.1.100', data: '2024-01-15T10:30:00', detalhes: { tipo: 'Compra e Venda', valor: 250000 } },
  { id: '2', usuario: 'Carlos', acao: 'ATUALIZAR_PESSOA', descricao: 'Atualizou dados de João Silva', entidade: 'Pessoa', entidadeId: '1', ip: '192.168.1.101', data: '2024-01-15T09:15:00', detalhes: { campo: 'telefone' } },
  { id: '3', usuario: 'Ana', acao: 'EXCLUIR_DOCUMENTO', descricao: 'Excluiu documento Procuração v2', entidade: 'Documento', entidadeId: '9', ip: '192.168.1.102', data: '2024-01-14T16:45:00', detalhes: {} },
  { id: '4', usuario: 'Admin', acao: 'CONCLUIR_PROTOCOLO', descricao: 'Concluiu protocolo 2024/0001', entidade: 'Protocolo', entidadeId: '1', ip: '192.168.1.100', data: '2024-01-14T14:30:00', detalhes: {} },
  { id: '5', usuario: 'Roberto', acao: 'LOGIN', descricao: 'Efetuou login no sistema', entidade: 'Sessão', entidadeId: '', ip: '192.168.1.103', data: '2024-01-14T08:00:00', detalhes: {} },
  { id: '6', usuario: 'Juliana', acao: 'ANEXAR_DOCUMENTO', descricao: 'Anexou documento ao protocolo 2024/0004', entidade: 'Documento', entidadeId: '10', ip: '192.168.1.104', data: '2024-01-13T11:20:00', detalhes: { nome: 'Certidão Casamento' } },
  { id: '7', usuario: 'Marcos', acao: 'SISCOAF_ANALISE', descricao: 'Realizou análise COAF protocolo 2024/0010', entidade: 'SISCOAF', entidadeId: '3', ip: '192.168.1.105', data: '2024-01-20T09:00:00', detalhes: { resultado: 'APROVADO' } },
  { id: '8', usuario: 'Admin', acao: 'CRIAR_USUARIO', descricao: 'Criou usuário Maria Souza', entidade: 'Usuário', entidadeId: '5', ip: '192.168.1.100', data: '2024-01-10T15:00:00', detalhes: { role: 'ESCREVENTE' } },
];
