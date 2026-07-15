import { PrismaClient, PersonType, ServiceType, ProtocolStatus, RiskLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.financeRecord.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.siscoafAnalysis.deleteMany();
  await prisma.siscoafParameter.deleteMany();
  await prisma.siscoafIndicator.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.document.deleteMany();
  await prisma.protocolParty.deleteMany();
  await prisma.protocolProperty.deleteMany();
  await prisma.protocol.deleteMany();
  await prisma.property.deleteMany();
  await prisma.person.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.decisionTree.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create roles
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrador do sistema - acesso total',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:create', 'people:read', 'people:update', 'people:delete',
          'properties:create', 'properties:read', 'properties:update', 'properties:delete',
          'protocols:create', 'protocols:read', 'protocols:update', 'protocols:delete', 'protocols:cancel', 'protocols:conclude',
          'documents:upload', 'documents:read', 'documents:delete',
          'siscoaf:view', 'siscoaf:analyze', 'siscoaf:configure', 'siscoaf:communicate',
          'users:create', 'users:read', 'users:update', 'users:delete',
          'roles:manage',
          'audit:view', 'audit:export',
          'reports:view', 'reports:export',
          'finance:view', 'finance:manage',
          'settings:manage',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'tabeliao',
        description: 'Tabelião - gestão e revisão de atos',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:create', 'people:read', 'people:update',
          'properties:create', 'properties:read', 'properties:update',
          'protocols:create', 'protocols:read', 'protocols:update', 'protocols:cancel', 'protocols:conclude',
          'documents:upload', 'documents:read',
          'siscoaf:view', 'siscoaf:analyze', 'siscoaf:communicate',
          'users:read',
          'audit:view',
          'reports:view', 'reports:export',
          'finance:view',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'substituto',
        description: 'Substituto do tabelião',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:create', 'people:read', 'people:update',
          'properties:create', 'properties:read', 'properties:update',
          'protocols:create', 'protocols:read', 'protocols:update', 'protocols:conclude',
          'documents:upload', 'documents:read',
          'siscoaf:view', 'siscoaf:analyze',
          'reports:view',
          'finance:view',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'escrevente',
        description: 'Escrevente - operações do dia a dia',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:create', 'people:read', 'people:update',
          'properties:create', 'properties:read', 'properties:update',
          'protocols:create', 'protocols:read', 'protocols:update',
          'documents:upload', 'documents:read',
          'siscoaf:view', 'siscoaf:analyze',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'recepcao',
        description: 'Recepção - atendimento inicial',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:create', 'people:read',
          'protocols:create', 'protocols:read',
          'documents:upload',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'financeiro',
        description: 'Financeiro - gestão financeira',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:read',
          'protocols:read',
          'finance:view', 'finance:manage',
          'reports:view', 'reports:export',
        ],
      },
    }),
    prisma.role.create({
      data: {
        name: 'consulta',
        description: 'Consulta - acesso apenas para visualização',
        isSystem: true,
        permissions: [
          'dashboard:view',
          'people:read',
          'properties:read',
          'protocols:read',
          'documents:read',
          'reports:view',
        ],
      },
    }),
  ]);

  console.log('✅ Roles created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@atlas.com',
      name: 'Administrador',
      password: adminPassword,
      roleId: roles[0].id,
      isActive: true,
      serventia: 'Atlas Cartórios',
    },
  });

  // Create escreventes
  const escrevente1 = await prisma.user.create({
    data: {
      email: 'joao@atlas.com',
      name: 'João Silva',
      password: await bcrypt.hash('123456', 10),
      roleId: roles[3].id,
      isActive: true,
      serventia: 'Atlas Cartórios',
    },
  });

  const escrevente2 = await prisma.user.create({
    data: {
      email: 'maria@atlas.com',
      name: 'Maria Santos',
      password: await bcrypt.hash('123456', 10),
      roleId: roles[3].id,
      isActive: true,
      serventia: 'Atlas Cartórios',
    },
  });

  const recepcao = await prisma.user.create({
    data: {
      email: 'ana@atlas.com',
      name: 'Ana Oliveira',
      password: await bcrypt.hash('123456', 10),
      roleId: roles[4].id,
      isActive: true,
      serventia: 'Atlas Cartórios',
    },
  });

  console.log('✅ Users created');

  // Create people (both PF and PJ)
  const people = await Promise.all([
    prisma.person.create({
      data: {
        type: PersonType.PF,
        name: 'Carlos Alberto de Souza',
        cpf: '12345678909',
        rg: '12.345.678-9',
        estadoCivil: 'Casado',
        profissao: 'Empresário',
        nacionalidade: 'Brasileira',
        dataNascimento: new Date('1980-05-15'),
        telefone: '(11) 98765-4321',
        email: 'carlos@email.com',
        cep: '01310-100',
        endereco: 'Av. Paulista, 1000',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
    prisma.person.create({
      data: {
        type: PersonType.PF,
        name: 'Maria Aparecida Lima',
        cpf: '98765432100',
        rg: '98.765.432-1',
        estadoCivil: 'Solteira',
        profissao: 'Médica',
        nacionalidade: 'Brasileira',
        dataNascimento: new Date('1985-08-22'),
        telefone: '(11) 97654-3210',
        email: 'maria.lima@email.com',
        cep: '04532-001',
        endereco: 'Rua Oscar Freire, 500',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
    prisma.person.create({
      data: {
        type: PersonType.PF,
        name: 'Pedro Henrique Costa',
        cpf: '45678912300',
        rg: '45.678.912-3',
        estadoCivil: 'Casado',
        profissao: 'Advogado',
        nacionalidade: 'Brasileira',
        dataNascimento: new Date('1975-12-01'),
        telefone: '(11) 96543-2109',
        email: 'pedro.costa@email.com',
        cep: '01414-000',
        endereco: 'Rua Augusta, 1500',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
    prisma.person.create({
      data: {
        type: PersonType.PJ,
        name: 'Imobiliária ABC Ltda',
        cnpj: '11222333000181',
        profissao: 'Imobiliária',
        telefone: '(11) 3000-1234',
        email: 'contato@abcimobiliaria.com.br',
        cep: '01311-000',
        endereco: 'Rua da Consolação, 2000',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
    prisma.person.create({
      data: {
        type: PersonType.PJ,
        name: 'Construtora XYZ S.A.',
        cnpj: '22333444000192',
        profissao: 'Construção Civil',
        telefone: '(11) 4000-5678',
        email: 'financeiro@construtoraxyz.com.br',
        cep: '04543-000',
        endereco: 'Av. Brigadeiro Faria Lima, 3000',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
    prisma.person.create({
      data: {
        type: PersonType.PF,
        name: 'Ana Beatriz Oliveira',
        cpf: '32165498700',
        rg: '32.165.498-7',
        estadoCivil: 'Divorciada',
        profissao: 'Professora',
        nacionalidade: 'Brasileira',
        dataNascimento: new Date('1990-03-10'),
        telefone: '(11) 95432-1098',
        email: 'ana.oliveira@email.com',
        cep: '02022-000',
        endereco: 'Rua Tupi, 500',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }),
  ]);

  console.log('✅ People created');

  // Create properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        matricula: '123456',
        livro: '2',
        folha: '150',
        endereco: 'Rua das Flores, 123 - Jardim Paulista',
        municipio: 'São Paulo',
        area: '350 m²',
        inscricaoMunicipal: '2024.001.123-4',
        ccir: 'CCIR-2024-123456',
        itr: 'ITR-2024-789012',
        car: 'CAR-SP-1234567890',
        confrontacoes: 'Norte: Rua A, Sul: Rua B, Leste: terreno 45, Oeste: Rua C',
        observacoes: 'Imóvel residencial com 3 suites',
      },
    }),
    prisma.property.create({
      data: {
        matricula: '789012',
        livro: '3',
        folha: '45',
        endereco: 'Av. Principal, 500 - Centro',
        municipio: 'São Paulo',
        area: '200 m²',
        inscricaoMunicipal: '2024.001.567-8',
        ccir: 'CCIR-2024-789013',
        itr: 'ITR-2024-789013',
        confrontacoes: 'Norte: Loja 10, Sul: Loja 12, Leste: Av. Principal, Oeste: Rua 5',
        observacoes: 'Ponto comercial em região privilegiada',
      },
    }),
    prisma.property.create({
      data: {
        matricula: '345678',
        livro: '1',
        folha: '200',
        endereco: 'Estrada Rural, Km 25 - Zona Rural',
        municipio: 'Cotia',
        area: '50.000 m²',
        inscricaoMunicipal: '2024.002.345-6',
        ccir: 'CCIR-2024-345678',
        itr: 'ITR-2024-345678',
        car: 'CAR-SP-9876543210',
        confrontacoes: 'Norte: Sítio Boa Vista, Sul: Córrego, Leste: Estrada, Oeste: Sítio São João',
        observacoes: 'Propriedade rural com cultivo de eucalipto',
      },
    }),
  ]);

  console.log('✅ Properties created');

  // Create protocols with different statuses
  const protocol1 = await prisma.protocol.create({
    data: {
      numero: '2026/00001',
      serviceType: ServiceType.COMPRA_VENDA,
      status: ProtocolStatus.EM_ANDAMENTO,
      valor: 850000.00,
      escreventeId: escrevente1.id,
      observacoes: 'Compra e venda de imóvel residencial',
      parties: {
        create: [
          { personId: people[0].id, role: 'VENDEDOR' },
          { personId: people[1].id, role: 'COMPRADOR' },
        ],
      },
      properties: {
        create: [{ propertyId: properties[0].id }],
      },
    },
  });

  const protocol2 = await prisma.protocol.create({
    data: {
      numero: '2026/00002',
      serviceType: ServiceType.DOACAO,
      status: ProtocolStatus.CONCLUIDO,
      valor: 0,
      escreventeId: escrevente1.id,
      dataConclusao: new Date('2026-01-20'),
      observacoes: 'Doação de imóvel para filho',
      parties: {
        create: [
          { personId: people[2].id, role: 'DOADOR' },
          { personId: people[5].id, role: 'DONATARIO' },
        ],
      },
      properties: {
        create: [{ propertyId: properties[1].id }],
      },
    },
  });

  const protocol3 = await prisma.protocol.create({
    data: {
      numero: '2026/00003',
      serviceType: ServiceType.PROCURACAO,
      status: ProtocolStatus.CONCLUIDO,
      valor: 150.00,
      escreventeId: escrevente2.id,
      dataConclusao: new Date('2026-01-18'),
      observacoes: 'Procuração pública para representação',
      parties: {
        create: [{ personId: people[0].id, role: 'OUTORGANTE' }],
      },
    },
  });

  const protocol4 = await prisma.protocol.create({
    data: {
      numero: '2026/00004',
      serviceType: ServiceType.COMPRA_VENDA,
      status: ProtocolStatus.AGUARDANDO_DOCUMENTOS,
      valor: 1200000.00,
      escreventeId: escrevente2.id,
      observacoes: 'Aguardando ITBI e certidões',
      parties: {
        create: [
          { personId: people[3].id, role: 'VENDEDOR' },
          { personId: people[1].id, role: 'COMPRADOR' },
        ],
      },
      properties: {
        create: [{ propertyId: properties[2].id }],
      },
    },
  });

  const protocol5 = await prisma.protocol.create({
    data: {
      numero: '2026/00005',
      serviceType: ServiceType.COMPRA_VENDA,
      status: ProtocolStatus.ABERTO,
      valor: null,
      escreventeId: escrevente1.id,
      observacoes: 'Novo protocolo de escritura',
      parties: {
        create: [
          { personId: people[0].id, role: 'VENDEDOR' },
          { personId: people[5].id, role: 'COMPRADOR' },
        ],
      },
    },
  });

  console.log('✅ Protocols created');

  // Create SISCOAF indicators
  const indicators = await Promise.all([
    prisma.siscoafIndicator.create({
      data: {
        description: 'Operação de alto valor (acima de R$ 1.000.000,00)',
        weight: 30,
        category: 'financial',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Lei 9.613/98, art. 11',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Operação com valor fracionado para evitar limites legais',
        weight: 40,
        category: 'financial',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Circular BCB 3.978/2020',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Valor incompatível com a capacidade financeira das partes',
        weight: 35,
        category: 'financial',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Carta Circular BCB 4.001/2020',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Operação com parte estrangeira sem residência fiscal no Brasil',
        weight: 25,
        category: 'parties',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Lei 9.613/98',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Parte classificada como PEP (Pessoa Exposta Politicamente)',
        weight: 30,
        category: 'parties',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Circular BCB 3.978/2020, art. 27',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Múltiplas partes envolvidas na operação (mais de 5)',
        weight: 15,
        category: 'parties',
        isRequired: false,
        isOptional: true,
        normativeReference: 'IN RFB 1.530/2014',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Imóvel rural com área superior a 100 hectares',
        weight: 20,
        category: 'property',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Lei 9.613/98',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Múltiplos imóveis na mesma operação (mais de 3)',
        weight: 20,
        category: 'property',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Carta Circular BCB 4.001/2020',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Urgência incomum na realização do negócio',
        weight: 25,
        category: 'operational',
        isRequired: false,
        isOptional: true,
        normativeReference: 'Lei 9.613/98',
        active: true,
      },
    }),
    prisma.siscoafIndicator.create({
      data: {
        description: 'Documentação incompleta ou com indícios de falsidade',
        weight: 45,
        category: 'documental',
        isRequired: true,
        isOptional: false,
        normativeReference: 'Provimento CNJ 88/2019',
        active: true,
      },
    }),
  ]);

  console.log('✅ SISCOAF indicators created');

  // Create SISCOAF parameters
  await Promise.all([
    prisma.siscoafParameter.create({
      data: { key: 'veryHighThreshold', name: 'Limite Muito Alto', value: '70', description: 'Percentual para risco muito alto', category: 'thresholds' },
    }),
    prisma.siscoafParameter.create({
      data: { key: 'highThreshold', name: 'Limite Alto', value: '50', description: 'Percentual para risco alto', category: 'thresholds' },
    }),
    prisma.siscoafParameter.create({
      data: { key: 'mediumThreshold', name: 'Limite Médio', value: '30', description: 'Percentual para risco médio', category: 'thresholds' },
    }),
    prisma.siscoafParameter.create({
      data: { key: 'highValueThreshold', name: 'Valor Alto', value: '1000000', description: 'Valor mínimo para considerar operação de alto valor', category: 'rules' },
    }),
    prisma.siscoafParameter.create({
      data: { key: 'maxPropertiesInOperation', name: 'Máx. Imóveis', value: '3', description: 'Número máximo de imóveis antes de acionar alerta', category: 'rules' },
    }),
  ]);

  console.log('✅ SISCOAF parameters created');

  // Create SISCOAF analysis for protocol2
  const analysis = await prisma.siscoafAnalysis.create({
    data: {
      protocolId: protocol2.id,
      score: 15,
      riskLevel: RiskLevel.LOW,
      indicators: [
        {
          indicatorId: indicators[0].id,
          description: 'Operação de alto valor',
          weight: 30,
          triggered: false,
          score: 0,
        },
        {
          indicatorId: indicators[3].id,
          description: 'Parte estrangeira',
          weight: 25,
          triggered: false,
          score: 0,
        },
        {
          indicatorId: indicators[8].id,
          description: 'Urgência incomum',
          weight: 25,
          triggered: false,
          score: 0,
        },
        {
          indicatorId: indicators[9].id,
          description: 'Documentação incompleta',
          weight: 45,
          triggered: true,
          score: 15,
          details: 'Documentação apresentada dentro do prazo, sem irregularidades',
        },
      ],
      decision: 'NAO_COMUNICAR',
      analyzedById: adminUser.id,
      analyzedAt: new Date('2026-01-19'),
    },
  });

  console.log('✅ SISCOAF analyses created');

  // Create decision tree for COAF communication
  await prisma.decisionTree.create({
    data: {
      name: 'Árvore de Decisão - Comunicação ao COAF',
      description: 'Árvore para auxiliar na decisão de comunicar operações ao COAF',
      active: true,
      version: 1,
      nodes: [
        {
          id: 'root',
          question: 'A operação possui indícios de lavagem de dinheiro?',
          answers: [
            { label: 'Sim', nextNodeId: 'high_risk' },
            { label: 'Não', nextNodeId: 'documentation' },
          ],
        },
        {
          id: 'high_risk',
          question: 'O score de risco SISCOAF é ALTO ou MUITO ALTO?',
          answers: [
            { label: 'Sim', nextNodeId: 'communicate' },
            { label: 'Não', nextNodeId: 'review_indicators' },
          ],
        },
        {
          id: 'documentation',
          question: 'A documentação está completa e regular?',
          answers: [
            { label: 'Sim', nextNodeId: 'no_communicate' },
            { label: 'Não', nextNodeId: 'request_docs' },
          ],
        },
        {
          id: 'review_indicators',
          question: 'Após revisão, há pelo menos 2 indicadores críticos acionados?',
          answers: [
            { label: 'Sim', nextNodeId: 'communicate' },
            { label: 'Não', nextNodeId: 'no_communicate' },
          ],
        },
        {
          id: 'request_docs',
          question: 'Os documentos solicitados foram apresentados?',
          answers: [
            { label: 'Sim, documentação OK', nextNodeId: 'no_communicate' },
            { label: 'Não, documentos insuficientes', nextNodeId: 'communicate' },
          ],
        },
        {
          id: 'communicate',
          question: '',
          isLeaf: true,
          result: 'COMUNICAR_AO_COAF',
        },
        {
          id: 'no_communicate',
          question: '',
          isLeaf: true,
          result: 'NAO_COMUNICAR',
        },
      ],
    },
  });

  console.log('✅ Decision tree created');

  // Create rules
  await Promise.all([
    prisma.rule.create({
      data: {
        name: 'Alto valor financeiro',
        description: 'Dispara quando o valor do protocolo ultrapassa R$ 1.000.000,00',
        active: true,
        priority: 10,
        category: 'compliance',
        conditions: {
          field: 'valor',
          operator: 'greater_than',
          value: 1000000,
        },
        actions: [
          { type: 'notify', params: { title: 'Operação de Alto Valor', message: 'Protocolo com valor acima de R$ 1.000.000,00' } },
          { type: 'request_siscoaf_analysis', params: {} },
        ],
      },
    }),
    prisma.rule.create({
      data: {
        name: 'Múltiplos imóveis',
        description: 'Dispara quando o protocolo envolve mais de 3 imóveis',
        active: true,
        priority: 5,
        category: 'compliance',
        conditions: {
          field: 'properties.length',
          operator: 'greater_than',
          value: 3,
        },
        actions: [
          { type: 'warn', params: { message: 'Operação com múltiplos imóveis requer atenção' } },
          { type: 'request_siscoaf_analysis', params: {} },
        ],
      },
    }),
    prisma.rule.create({
      data: {
        name: 'Parte estrangeira',
        description: 'Alerta quando há parte estrangeira envolvida',
        active: true,
        priority: 8,
        category: 'compliance',
        conditions: {
          field: 'nacionalidade',
          operator: 'not_equals',
          value: 'Brasileira',
        },
        actions: [
          { type: 'block', params: { reason: 'Parte estrangeira requer verificação adicional', field: 'partes' } },
          { type: 'notify', params: { title: 'Parte Estrangeira', message: 'Protocolo com parte estrangeira requer análise especial' } },
        ],
      },
    }),
  ]);

  console.log('✅ Rules created');

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: escrevente1.id,
        title: 'Protocolo em andamento',
        message: 'O protocolo 2026/00001 está aguardando documentos',
        type: 'document_pending',
        link: '/protocols/' + protocol1.id,
      },
    }),
    prisma.notification.create({
      data: {
        userId: escrevente2.id,
        title: 'Protocolo concluído',
        message: 'O protocolo 2026/00002 foi concluído com sucesso',
        type: 'protocol_concluded',
        link: '/protocols/' + protocol2.id,
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: escrevente2.id,
        title: 'Análise SISCOAF pendente',
        message: 'Protocolo 2026/00004 requer análise SISCOAF',
        type: 'analysis_pending',
        link: '/siscoaf/analyses/' + analysis.id,
      },
    }),
  ]);

  console.log('✅ Notifications created');

  // Create some audit logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'POST /api/v1/auth/login',
        entity: 'auth',
        userId: adminUser.id,
        userEmail: adminUser.email,
        method: 'POST',
        url: '/api/v1/auth/login',
        details: { message: 'Login realizado' },
        ip: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'POST /api/v1/protocols',
        entity: 'protocols',
        entityId: protocol1.id,
        userId: escrevente1.id,
        userEmail: escrevente1.email,
        method: 'POST',
        url: '/api/v1/protocols',
        details: { protocolNumber: protocol1.numero },
        ip: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'POST /api/v1/people',
        entity: 'people',
        entityId: people[0].id,
        userId: recepcao.id,
        userEmail: recepcao.email,
        method: 'POST',
        url: '/api/v1/people',
        details: { personName: people[0].name },
        ip: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
  ]);

  console.log('✅ Audit logs created');
  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Credenciais:');
  console.log('   Admin:    admin@atlas.com / admin123');
  console.log('   João:     joao@atlas.com / 123456');
  console.log('   Maria:    maria@atlas.com / 123456');
  console.log('   Ana:      ana@atlas.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
