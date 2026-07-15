export const users = [
  { id: '1', nome: 'Admin', email: 'admin@cartorio.com', role: 'ADMIN', avatar: '', ativo: true, ultimoAcesso: '2024-01-15T10:30:00' },
  { id: '2', nome: 'Carlos Souza', email: 'carlos@cartorio.com', role: 'ESCREVENTE', avatar: '', ativo: true, ultimoAcesso: '2024-01-15T09:15:00' },
  { id: '3', nome: 'Ana Oliveira', email: 'ana@cartorio.com', role: 'ESCREVENTE', avatar: '', ativo: true, ultimoAcesso: '2024-01-14T16:45:00' },
  { id: '4', nome: 'Roberto Lima', email: 'roberto@cartorio.com', role: 'ESCREVENTE', avatar: '', ativo: true, ultimoAcesso: '2024-01-14T14:30:00' },
  { id: '5', nome: 'Juliana Costa', email: 'juliana@cartorio.com', role: 'ESCREVENTE', avatar: '', ativo: false, ultimoAcesso: '2024-01-10T11:20:00' },
  { id: '6', nome: 'Marcos Alves', email: 'marcos@cartorio.com', role: 'TABELIAO', avatar: '', ativo: true, ultimoAcesso: '2024-01-15T08:00:00' },
];

export const roles = [
  { id: '1', nome: 'ADMIN', descricao: 'Administrador do sistema', permissoes: ['*'], usuarios: 1 },
  { id: '2', nome: 'TABELIAO', descricao: 'Tabelião do cartório', permissoes: ['dashboard.*', 'protocolos.*', 'pessoas.*', 'imoveis.*', 'documentos.*', 'financeiro.*', 'siscoaf.*', 'relatorios.*', 'auditoria.*'], usuarios: 1 },
  { id: '3', nome: 'ESCREVENTE', descricao: 'Escrevente do cartório', permissoes: ['dashboard.ler', 'protocolos.criar', 'protocolos.editar', 'protocolos.ler', 'pessoas.*', 'imoveis.*', 'documentos.*'], usuarios: 4 },
  { id: '4', nome: 'ASSISTENTE', descricao: 'Assistente administrativo', permissoes: ['dashboard.ler', 'protocolos.ler', 'pessoas.ler', 'imoveis.ler'], usuarios: 0 },
];
