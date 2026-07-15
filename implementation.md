# Plano de Implementação - Registro Civil

## MVP (Minimum Viable Product)

### Sprint 1: Fundação e Estrutura Base (1-2 semanas)

**Objetivo:** Estabelecer a base do projeto, estrutura de diretórios, PWA e design system.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 1.1 | Criar estrutura de diretórios (css/, js/, assets/) | ✅ |
| 1.2 | Implementar design system no CSS (cores, tipografia, grid, componentes) | ✅ |
| 1.3 | Criar index.html com layout SPA (sidebar + conteúdo) | ✅ |
| 1.4 | Configurar PWA (manifest.json, service worker) | ✅ |
| 1.5 | Implementar db.js - abstraction sobre localStorage | ✅ |
| 1.6 | Implementar app.js - sistema de navegação/routing | ✅ |
| 1.7 | Criar dashboard com estatísticas e registros recentes | ✅ |

**Entregáveis:**
- PWA instalável, responsivo, funcionando offline
- Navegação funcional entre seções
- Dashboard com contadores dinâmicos

---

### Sprint 2: CRUD de Registros (2-3 semanas)

**Objetivo:** Implementar cadastro completo dos 4 tipos de registro.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 2.1 | Formulário de Nascimento (campos específicos + validação) | ✅ |
| 2.2 | Tabela de listagem com busca textual para Nascimento | ✅ |
| 2.3 | Edição e exclusão de registros de Nascimento | ✅ |
| 2.4 | Formulário de Casamento (campos + validação) | ✅ |
| 2.5 | Tabela, edição e exclusão para Casamento | ✅ |
| 2.6 | Formulário de Óbito (campos + validação) | ✅ |
| 2.7 | Tabela, edição e exclusão para Óbito | ✅ |
| 2.8 | Formulário de Livro E (campos + validação) | ✅ |
| 2.9 | Tabela, edição e exclusão para Livro E | ✅ |

**Entregáveis:**
- CRUD completo para Nascimento, Casamento, Óbito e Livro E
- Busca textual em cada tipo de registro
- Modal de visualização de detalhes

---

### Sprint 3: Certidões e Consulta (1-2 semanas)

**Objetivo:** Implementar emissão de 2ª via de certidões e consulta geral.

| Tarefa | Descrição | Status |
|--------|-----------|--------|
| 3.1 | Tela de emissão de certidão (seleção de tipo + registro) | ✅ |
| 3.2 | Geração e armazenamento de certidão vinculada ao registro | ✅ |
| 3.3 | Exibição do comprovante de emissão | ✅ |
| 3.4 | Consulta geral com filtro por tipo e busca textual | ✅ |
| 3.5 | Badges dinâmicos nos itens do menu | ✅ |
| 3.6 | Exibição de certidões emitidas no detalhe do registro | ✅ |

**Entregáveis:**
- Emissão de certidões (Inteiro Teor, Resumida, Informativa)
- Histórico de certidões por registro
- Consulta geral com busca em todos os registros

---

### Sprint 4: Polimento e Testes (1 semana)

**Objetivo:** Finalizar MVP com melhorias de UX, testes e documentação.

| Tarefa | Descrição | Prioridade |
|--------|-----------|------------|
| 4.1 | Responsividade e testes em mobile/tablet | Alta |
| 4.2 | Testes de funcionalidades offline | Alta |
| 4.3 | Mensagens de confirmação e feedback (toast) | Média |
| 4.4 | Documentação (context.md, implementation.md) | Média |
| 4.5 | Revisão de acessibilidade (labels, contraste) | Média |
| 4.6 | Preparação para deploy (GitHub Pages / Netlify) | Baixa |

**Entregáveis:**
- MVP completo, testado e documentado
- Pronto para deploy e uso experimental

---

## Produto Final

### Sprint 5: Backend e API REST

**Objetivo:** Desenvolver backend com API RESTful.

| Tarefa | Descrição |
|--------|-----------|
| 5.1 | Setup do backend (Node.js + Express / NestJS) |
| 5.2 | Modelagem do banco de dados (PostgreSQL) |
| 5.3 | Migrations e seeds |
| 5.4 | Endpoints CRUD para registros (`/api/registros`) |
| 5.5 | Endpoints para certidões (`/api/certidoes`) |
| 5.6 | Validação de dados (Joi / Zod) |
| 5.7 | Tratamento de erros e logs |

**Entregáveis:**
- API REST documentada
- Banco de dados relacional populável

---

### Sprint 6: Autenticação e Autorização

**Objetivo:** Implementar segurança e controle de acesso.

| Tarefa | Descrição |
|--------|-----------|
| 6.1 | Cadastro e login de usuários |
| 6.2 | JWT (access + refresh tokens) |
| 6.3 | RBAC (papéis: admin, oficial, escrevente, auxiliar) |
| 6.4 | Proteção de rotas (middleware de autenticação) |
| 6.5 | Recuperação de senha |
| 6.6 | Sessão persistente (localStorage + token refresh) |

**Entregáveis:**
- Sistema de login funcional
- Controle de acesso por papel

---

### Sprint 7: Migração Frontend-Backend

**Objetivo:** Conectar frontend ao backend, substituindo localStorage.

| Tarefa | Descrição |
|--------|-----------|
| 7.1 | Criar camada API no frontend (fetch/axios) |
| 7.2 | Substituir chamadas a Db por chamadas API |
| 7.3 | Tratamento de estados (loading, erro, vazio) |
| 7.4 | Sincronização offline/online (opcional) |
| 7.5 | Paginação nas listagens |
| 7.6 | Filtros avançados (data, período, tipo) |

**Entregáveis:**
- Frontend consumindo API
- Dados persistidos no servidor

---

### Sprint 8: Geração de PDF e Certidões

**Objetivo:** Implementar geração de PDF das certidões.

| Tarefa | Descrição |
|--------|-----------|
| 8.1 | Template de certidão de Nascimento (PDF) |
| 8.2 | Template de certidão de Casamento (PDF) |
| 8.3 | Template de certidão de Óbito (PDF) |
| 8.4 | Template de certidão de Livro E (PDF) |
| 8.5 | Download e impressão do PDF |
| 8.6 | Marca d'água e numeração de controle |

**Entregáveis:**
- PDFs formatados conforme padrões CNJ
- Download e impressão

---

### Sprint 9: Relatórios e Exportação

**Objetivo:** Gerar relatórios gerenciais e exportar dados.

| Tarefa | Descrição |
|--------|-----------|
| 9.1 | Relatório mensal de registros por tipo |
| 9.2 | Relatório de certidões emitidas (período) |
| 9.3 | Relatório financeiro (valores de certidões) |
| 9.4 | Exportação CSV/Excel |
| 9.5 | Gráficos no dashboard (Chart.js / ApexCharts) |

**Entregáveis:**
- Relatórios em tela, PDF e CSV
- Dashboard com gráficos interativos

---

### Sprint 10: Backup, Segurança e Deploy

**Objetivo:** Preparar sistema para produção.

| Tarefa | Descrição |
|--------|-----------|
| 10.1 | Backup automático do banco de dados |
| 10.2 | Logs de auditoria (quem criou/editou/excluiu) |
| 10.3 | Sanitização e validação avançada (XSS, SQL Injection) |
| 10.4 | Rate limiting e proteção contra brute force |
| 10.5 | Containerização (Docker + docker-compose) |
| 10.6 | Configuração de Nginx + SSL |
| 10.7 | Deploy em VPS |
| 10.8 | Monitoramento (uptime, erros, desempenho) |

**Entregáveis:**
- Sistema em produção
- Ambiente seguro e monitorado

---

### Sprint 11: Funcionalidades Avançadas

**Objetivo:** Adicionar integrações e funcionalidades extras.

| Tarefa | Descrição |
|--------|-----------|
| 11.1 | Integração com API do CNJ (consulta de registros) |
| 11.2 | Notificações push (PWA) |
| 11.3 | Modo escuro (dark mode) |
| 11.4 | Atalhos de teclado |
| 11.5 | Histórico de alterações por registro |
| 11.6 | Busca avançada com filtros combinados |
| 11.7 | Impressão de termos de registro |
| 11.8 | Suporte a múltiplos cartórios (multi-tenancy) |

**Entregáveis:**
- Funcionalidades avançadas para power users
- Integração com sistemas externos

---

## Critérios de Aceitação do MVP

- [x] PWA instalável e funcionando offline
- [x] Dashboard com visão geral dos registros
- [x] CRUD completo para Nascimento, Casamento, Óbito e Livro E
- [x] Emissão de 2ª via de certidões
- [x] Busca textual em todos os registros
- [x] Interface responsiva (desktop, tablet, mobile)
- [x] Dados persistidos localmente (localStorage)
- [x] Sem necessidade de servidor ou internet

---

## Observações

- O MVP **não** possui autenticação — qualquer pessoa com acesso ao dispositivo pode operar o sistema
- O MVP **não** gera PDF — as certidões são armazenadas como dados textuais
- Recomenda-se fazer backup manual do localStorage via DevTools (Application → Local Storage → Export)
- A migração do MVP para o produto final requer reescrita da camada de persistência
- O roadmap acima é sugestivo e deve ser ajustado conforme feedback dos usuários
