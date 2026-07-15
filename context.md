# Contexto e Arquitetura - Sistema de Registro Civil

## 1. Contexto do Problema

### 1.1 Cenário Atual
Cartórios de Registro Civil de Pessoas Naturais (RCPN) no Brasil realizam o registro oficial de:

- **Nascimentos**
- **Casamentos**
- **Óbitos**
- **Atos diversos** (Livro E): emancipações, interdições, tutelas, curatelas, ausências, etc.
- **Emissão de 2ª vias de certidões**

Muitos cartórios ainda operam com sistemas legados, planilhas ou processos manuais, resultando em baixa eficiência, risco de perda de dados e dificuldade na emissão de certidões.

### 1.2 Objetivo
Desenvolver um sistema moderno, responsivo e progressivo (PWA) para gestão de registros civis, que funcione online e offline, permitindo o cadastro, consulta, edição e emissão de certidões de forma ágil e segura.

---

## 2. Arquitetura do Sistema

### 2.1 Visão Geral (Produto Final)

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (PWA)                        │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────────┐ │
│  │ Dashboard │  │ Cadastro  │  │ Emissão de          │ │
│  │           │  │ Registros │  │ Certidões           │ │
│  └───────────┘  └───────────┘  └─────────────────────┘ │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────────┐ │
│  │ Consulta  │  │ Relatórios│  │ Configurações       │ │
│  └───────────┘  └───────────┘  └─────────────────────┘ │
│                    Service Worker                        │
│                    Cache / Offline                       │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                    Backend (API)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Auth/Login  │  │ CRUD        │  │ Geração PDF     │ │
│  │ JWT         │  │ Registros   │  │ Certidões       │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Validação   │  │ Auditoria   │  │ Backup/Export   │ │
│  │ (CPF/RG)    │  │ (Logs)      │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Banco de Dados                        │
│           PostgreSQL / MySQL / SQLite                    │
│   Tabelas: registros, certidoes, usuarios, audit_log    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Arquitetura MVP (Atual)

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (PWA) - SPA                   │
│                                                          │
│  index.html (shell)                                      │
│    ├── css/style.css (design system)                     │
│    ├── js/db.js (localStorage abstraction)               │
│    ├── js/app.js (routing, UI, forms, certidoes)         │
│    ├── manifest.json (PWA config)                        │
│    └── sw.js (service worker + cache)                    │
│                                                          │
│  Dados: localStorage (persistência local)                │
│  Cache: Cache API (offline primeiro)                     │
└──────────────────────────────────────────────────────────┘
```

### 2.3 Stack Tecnológica

| Camada      | MVP                    | Produto Final              |
|-------------|------------------------|----------------------------|
| Frontend    | HTML5 + CSS3 + Vanilla JS | React / Vue.js + Tailwind  |
| PWA         | Service Worker + Manifest | Service Worker + Manifest + Push |
| Persistência| localStorage           | SQLite (local) / PostgreSQL (servidor) |
| Backend     | — (serverless)         | Node.js (Express/NestJS) + REST API |
| Autenticação| —                      | JWT + RBAC                 |
| PDF         | —                      | Puppeteer / jsPDF          |
| Implantação | GitHub Pages / Netlify | VPS + Docker + Nginx       |
| Backup      | —                      | Automático + Exportação    |

---

## 3. Estrutura de Dados

### 3.1 Modelo de Registro (MVP)

```javascript
{
  // Metadados
  id: "string (unique)",
  tipo: "nascimento | casamento | obito | livro-e",
  createdAt: "ISO datetime",
  updatedAt: "ISO datetime",

  // Comuns a todos os tipos
  numeroTermo: "string",
  livro: "string",
  folha: "string",
  dataRegistro: "date",
  observacoes: "string (opcional)",

  // Específicos de Nascimento
  nome: "string",
  dataNascimento: "date",
  sexo: "Masculino | Feminino",
  horaNascimento: "time (opcional)",
  naturalidade: "string (opcional)",
  nomePai: "string (opcional)",
  profissaoPai: "string (opcional)",
  nomeMae: "string",
  profissaoMae: "string (opcional)",

  // Específicos de Casamento
  nomeConjuge1: "string",
  nomeConjuge2: "string",
  dataCasamento: "date",
  regimeBens: "string (enum)",

  // Específicos de Óbito
  nomeFalecido: "string",
  dataObito: "date",
  causaObito: "string (opcional)",
  localObito: "string (opcional)",

  // Específicos de Livro E
  tipoAto: "string",
  partesEnvolvidas: "string (opcional)",
  descricao: "string (textarea)",

  // Certidões emitidas
  certidoes: [
    {
      id: "string (unique)",
      tipoCertidao: "Inteiro Teor | Resumida | Informativa",
      finalidade: "string",
      valor: "number",
      dataEmissao: "ISO datetime"
    }
  ]
}
```

### 3.2 Modelo de Dados (Produto Final - Relacional)

```sql
-- Tabela base de registros
CREATE TABLE registros (
  id UUID PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  numero_termo VARCHAR(20) NOT NULL,
  livro VARCHAR(20) NOT NULL,
  folha VARCHAR(10) NOT NULL,
  data_registro DATE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES usuarios(id),
  deleted_at TIMESTAMP
);

-- Tabelas especializadas (herança)
CREATE TABLE registros_nascimento (
  id UUID PRIMARY KEY REFERENCES registros(id),
  nome VARCHAR(255) NOT NULL,
  data_nascimento DATE NOT NULL,
  sexo VARCHAR(20),
  hora_nascimento TIME,
  naturalidade VARCHAR(255),
  nome_pai VARCHAR(255),
  profissao_pai VARCHAR(255),
  nome_mae VARCHAR(255) NOT NULL,
  profissao_mae VARCHAR(255)
);

CREATE TABLE registros_casamento (
  id UUID PRIMARY KEY REFERENCES registros(id),
  nome_conjuge1 VARCHAR(255) NOT NULL,
  nome_conjuge2 VARCHAR(255) NOT NULL,
  data_casamento DATE NOT NULL,
  regime_bens VARCHAR(100)
);

CREATE TABLE registros_obito (
  id UUID PRIMARY KEY REFERENCES registros(id),
  nome_falecido VARCHAR(255) NOT NULL,
  data_obito DATE NOT NULL,
  causa_obito TEXT,
  local_obito VARCHAR(255)
);

CREATE TABLE registros_livro_e (
  id UUID PRIMARY KEY REFERENCES registros(id),
  tipo_ato VARCHAR(255) NOT NULL,
  partes_envolvidas TEXT,
  descricao TEXT
);

-- Certidões
CREATE TABLE certidoes (
  id UUID PRIMARY KEY,
  registro_id UUID NOT NULL REFERENCES registros(id),
  tipo_certidao VARCHAR(50) NOT NULL,
  finalidade VARCHAR(255),
  valor DECIMAL(10,2),
  data_emissao TIMESTAMP DEFAULT NOW(),
  emitido_por UUID REFERENCES usuarios(id)
);
```

---

## 4. Fluxo de Navegação (MVP)

```
Dashboard
  ├── Ver estatísticas (contadores por tipo)
  ├── Ver registros recentes
  │
  ├── Nascimento → Lista → Novo / Editar / Excluir / Visualizar
  ├── Casamento  → Lista → Novo / Editar / Excluir / Visualizar
  ├── Óbito      → Lista → Novo / Editar / Excluir / Visualizar
  ├── Livro E    → Lista → Novo / Editar / Excluir / Visualizar
  │
  ├── Certidões
  │     ├── Selecionar tipo de registro
  │     ├── Selecionar registro
  │     ├── Preencher dados da certidão
  │     └── Emitir (salvar + exibir comprovante)
  │
  └── Consulta
        ├── Filtrar por tipo
        ├── Busca textual
        └── Resultados com ações
```

---

## 5. Princípios de Design

- **Offline First**: Service Worker cacheia todos os assets e permite uso sem internet
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Acessível**: Contraste adequado, labels semânticas
- **Performance**: SPA sem frameworks pesados, carregamento instantâneo
- **Dados Locais**: MVP usa localStorage; produto final migra para backend com sync
- **Privacidade**: Dados nunca saem do dispositivo no MVP

---

## 6. Restrições e Premissas

- MVP não possui autenticação (uso local)
- MVP não gera PDF (apenas visualização e registro)
- MVP não possui backup automático (recomenda-se exportação manual via DevTools)
- Produto final requer servidor e banco de dados
- Sistema deve seguir normas do Conselho Nacional de Justiça (CNJ) para registros públicos
