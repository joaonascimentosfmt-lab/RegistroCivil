# Atlas Cartórios

Sistema ERP moderno para Cartórios Extrajudiciais brasileiros. Construído com arquitetura limpa, foco em produtividade e experiência do usuário.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Next.js 14 + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Node.js + NestJS + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 |
| Autenticação | JWT + Refresh Token |
| Upload | MinIO (S3-compatible) |
| Container | Docker + Docker Compose |

## Módulos

- **Dashboard** - Visão geral com gráficos e métricas
- **Pessoas** - Cadastro PF/PJ com validação de CPF/CNPJ
- **Imóveis** - Cadastro com matrícula, CCIR, ITR, CAR
- **Protocolos** - Fluxo completo com wizard de 8 etapas
- **Checklist Inteligente** - Documentos obrigatórios por tipo de serviço
- **Motor de Regras** - Engine configurável para automação de decisões
- **SISCOAF** - Análise de compliance com scoring parametrizável
- **Árvore de Decisão** - Fluxo interativo para comunicação COAF
- **Documentos** - Upload, versionamento, download
- **Financeiro** - Controle de receitas e despesas
- **Dashboard** - Gráficos e métricas em tempo real
- **Relatórios** - Protocolos, serviços, financeiro, produtividade
- **Auditoria** - Log completo de todas as operações
- **Usuários e Permissões** - RBAC granular

## Módulos

- **Dashboard** - Visão geral com gráficos e métricas
- **Pessoas** - Cadastro PF/PJ com validação de CPF/CNPJ
- **Imóveis** - Cadastro com matrícula, CCIR, ITR, CAR
- **Protocolos** - Fluxo completo com wizard de 8 etapas
- **Checklist Inteligente** - Documentos obrigatórios por tipo de serviço
- **Motor de Regras** - Engine configurável para automação de decisões
- **SISCOAF** - Análise de compliance com scoring parametrizável
- **Árvore de Decisão** - Fluxo interativo para comunicação COAF
- **Documentos** - Upload, versionamento, download
- **Financeiro** - Controle de receitas e despesas
- **Dashboard** - Gráficos e métricas em tempo real
- **Relatórios** - Protocolos, serviços, financeiro, produtividade
- **Auditoria** - Log completo de todas as operações
- **Usuários e Permissões** - RBAC granular

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (para ambiente completo)
- PostgreSQL 16 (ou usar Docker)

## Setup Rápido (Docker)

```bash
# Clone o repositório
git clone https://github.com/joaonascimentosfmt-lab/RegistroCivil.git
cd RegistroCivil/atlas-cartorios

# Inicie todos os serviços
docker-compose -f docker/docker-compose.yml up -d

# Execute as migrations e seed
docker exec atlas-backend npx prisma migrate deploy
docker exec atlas-backend npx prisma db seed
```

Acessos:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **Swagger**: http://localhost:3000/api/docs
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

## Setup Manual

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Credenciais Padrão (Seed)

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@cartorio.com | 123456 | Administrador |
| escrevente1@cartorio.com | 123456 | Escrevente |
| escrevente2@cartorio.com | 123456 | Escrevente |
| recepcao@cartorio.com | 123456 | Recepção |

## Módulos

- **Dashboard** - Visão geral com gráficos e métricas
- **Pessoas** - Cadastro PF/PJ com validação de CPF/CNPJ
- **Imóveis** - Cadastro com matrícula, CCIR, ITR, CAR
- **Protocolos** - Fluxo completo com wizard de 8 etapas
- **Checklist Inteligente** - Documentos obrigatórios por tipo de serviço
- **Motor de Regras** - Engine configurável para automação de decisões
- **SISCOAF** - Análise de compliance com scoring parametrizável
- **Árvore de Decisão** - Fluxo interativo para comunicação COAF
- **Documentos** - Upload, versionamento, download
- **Financeiro** - Controle de receitas e despesas
- **Dashboard** - Gráficos e métricas em tempo real
- **Relatórios** - Protocolos, serviços, financeiro, produtividade
- **Auditoria** - Log completo de todas as operações
- **Usuários e Permissões** - RBAC granular

## Setup Rápido (Docker)

```bash
docker-compose -f docker/docker-compose.yml up -d
docker exec atlas-backend npx prisma migrate deploy
docker exec atlas-backend npx prisma db seed
```

Acessos:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **Swagger**: http://localhost:3000/api/docs
- **MinIO Console**: http://localhost:9001

## Credenciais Padrão

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@cartorio.com | 123456 | Administrador |
| escrevente1@cartorio.com | 123456 | Escrevente |
| escrevente2@cartorio.com | 123456 | Escrevente |
| recepcao@cartorio.com | 123456 | Recepção |

## Módulos

### Dashboard
Visão geral do cartório com gráficos de movimento mensal, serviços mais realizados, protocolos recentes e desempenho por escrevente.

### Pessoas
Cadastro de Pessoa Física e Jurídica com validação de CPF/CNPJ, endereço completo e upload de documentos.

### Imóveis
Cadastro de imóveis com matrícula, livro, folha, CCIR, ITR, CAR e confrontações.

### Protocolos
Fluxo completo com wizard de 8 etapas:
1. Tipo do Ato
2. Partes
3. Imóveis
4. Documentos
5. Análise SISCOAF
6. Pendências
7. Resumo
8. Finalização

### Checklist Inteligente
Documentos obrigatórios por tipo de serviço, com status de conferência.

### Motor de Regras
Engine configurável que avalia condições e executa ações automaticamente. Suporta operadores: equals, contains, greater_than, regex, in, between, exists.

### SISCOAF
Módulo completo de compliance com:
- Indicadores parametrizáveis com pesos
- Scoring automático (Baixo/Médio/Alto/Muito Alto)
- Análise com justificativa e recomendação
- Decisão de comunicação

### Árvore de Decisão
Fluxo interativo de perguntas Sim/Não para determinar necessidade de comunicação ao COAF.

### Auditoria
Registro completo de todas as operações: login, logout, CRUD, visualizações, downloads.

## API Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Perfil do usuário

### Pessoas
- `GET/POST /api/v1/people` - Listar/Criar
- `GET/PUT/DELETE /api/v1/people/:id` - CRUD

### Imóveis
- `GET/POST /api/v1/properties` - Listar/Criar
- `GET/PUT/DELETE /api/v1/properties/:id` - CRUD

### Protocolos
- `GET/POST /api/v1/protocols` - Listar/Criar
- `GET/PUT/DELETE /api/v1/protocols/:id` - CRUD
- `PUT /api/v1/protocols/:id/status/:status` - Atualizar status

### SISCOAF
- `GET/POST /api/v1/siscoaf/indicators` - Indicadores
- `GET/POST /api/v1/siscoaf/analyses` - Análises
- `POST /api/v1/siscoaf/evaluate` - Avaliação automática

### Demais endpoints
- `/api/v1/people` - Pessoas
- `/api/v1/properties` - Imóveis
- `/api/v1/documents` - Documentos
- `/api/v1/checklist` - Checklist
- `/api/v1/rules-engine` - Motor de Regras
- `/api/v1/decision-tree` - Árvore de Decisão
- `/api/v1/dashboard` - Dashboard
- `/api/v1/reports` - Relatórios
- `/api/v1/audit` - Auditoria
- `/api/v1/finance` - Financeiro
- `/api/v1/notifications` - Notificações

## Setup

### Docker (recomendado)

```bash
docker-compose -f docker/docker-compose.yml up -d
docker exec atlas-backend npx prisma migrate deploy
docker exec atlas-backend npx prisma db seed
```

### Manual

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Credenciais Padrão

| Email | Senha | Perfil |
|-------|-------|--------|
| admin@cartorio.com | 123456 | Administrador |
| escrevente1@cartorio.com | 123456 | Escrevente |
| escrevente2@cartorio.com | 123456 | Escrevente |
| recepcao@cartorio.com | 123456 | Recepção |

## Licença

MIT
