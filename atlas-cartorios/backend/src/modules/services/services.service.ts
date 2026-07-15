import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceType } from '@prisma/client';
import { SERVICE_CHECKLIST_CONFIG } from './config/service-checklist.config';
import { SERVICE_FLOWS } from './config/service-flows';

@Injectable()
export class ServicesService {
  private readonly servicesCatalog: Record<string, any>;

  constructor() {
    this.servicesCatalog = this.buildServicesCatalog();
  }

  private buildServicesCatalog() {
    const serviceNames: Record<string, { name: string; description: string; legalBasis: string | null; suggestedValue: number | null }> = {
      COMPRA_VENDA: {
        name: 'Compra e Venda',
        description: 'Escritura de compra e venda de imóvel',
        legalBasis: 'Lei nº 8.935/94, art. 7º',
        suggestedValue: null,
      },
      DOACAO: {
        name: 'Doação',
        description: 'Escritura de doação de imóvel',
        legalBasis: 'Código Civil, arts. 538 a 564',
        suggestedValue: null,
      },
      PERMUTA: {
        name: 'Permuta',
        description: 'Escritura de permuta de imóveis',
        legalBasis: 'Código Civil, arts. 533 a 537',
        suggestedValue: null,
      },
      DIVORCIO: {
        name: 'Divórcio',
        description: 'Escritura de divórcio consensual',
        legalBasis: 'Provimento CNJ nº 73/2018',
        suggestedValue: null,
      },
      INVENTARIO: {
        name: 'Inventário',
        description: 'Escritura de inventário e partilha',
        legalBasis: 'Código Civil, arts. 2.012 a 2.036',
        suggestedValue: null,
      },
      USUCAPIAO: {
        name: 'Usucapião',
        description: 'Ata notarial para usucapião extrajudicial',
        legalBasis: 'Provimento CNJ nº 65/2017',
        suggestedValue: null,
      },
      ATA_NOTARIAL: {
        name: 'Ata Notarial',
        description: 'Ata notarial para constatação de fatos',
        legalBasis: 'Lei nº 8.935/94, art. 7º, III',
        suggestedValue: null,
      },
      PROCURACAO: {
        name: 'Procuração',
        description: 'Procuração pública',
        legalBasis: 'Código Civil, arts. 653 a 692',
        suggestedValue: null,
      },
      REVOGACAO: {
        name: 'Revogação de Procuração',
        description: 'Revogação de procuração pública',
        legalBasis: 'Código Civil, art. 682',
        suggestedValue: null,
      },
      TESTAMENTO: {
        name: 'Testamento',
        description: 'Testamento público',
        legalBasis: 'Código Civil, arts. 1.857 a 1.859',
        suggestedValue: null,
      },
      RECONHECIMENTO_FIRMA: {
        name: 'Reconhecimento de Firma',
        description: 'Reconhecimento de firma por autenticidade ou semelhança',
        legalBasis: 'Lei nº 8.935/94, art. 7º, II',
        suggestedValue: null,
      },
      AUTENTICACAO: {
        name: 'Autenticação',
        description: 'Autenticação de cópias de documentos',
        legalBasis: 'Lei nº 8.935/94, art. 7º, II',
        suggestedValue: null,
      },
      APOSTILAMENTO: {
        name: 'Apostilamento',
        description: 'Apostilamento de Haia',
        legalBasis: 'Convenção da Haia de 1961 - Decreto nº 8.660/2016',
        suggestedValue: null,
      },
      CERTIDAO: {
        name: 'Certidão',
        description: 'Emissão de certidão de atos registrados',
        legalBasis: 'Lei nº 8.935/94',
        suggestedValue: null,
      },
    };

    const catalog = {};
    for (const type of Object.values(ServiceType)) {
      const info = serviceNames[type];
      if (info) {
        catalog[type] = {
          type,
          ...info,
          requiredDocuments: SERVICE_CHECKLIST_CONFIG[type] || [],
          workflowSteps: SERVICE_FLOWS[type]?.map((s) => s.step) || [],
        };
      }
    }
    return catalog;
  }

  findAll() {
    return Object.values(this.servicesCatalog);
  }

  findOne(type: ServiceType) {
    const service = this.servicesCatalog[type];
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    return service;
  }

  getChecklist(type: ServiceType) {
    const docs = SERVICE_CHECKLIST_CONFIG[type];
    if (!docs) {
      throw new NotFoundException('Checklist não encontrado para este serviço');
    }
    return {
      serviceType: type,
      requiredDocuments: docs,
    };
  }

  getFlow(type: ServiceType) {
    const flow = SERVICE_FLOWS[type];
    if (!flow) {
      throw new NotFoundException('Fluxo não encontrado para este serviço');
    }
    return {
      serviceType: type,
      steps: flow,
    };
  }

  getServiceNames() {
    const serviceNames: Record<ServiceType, string> = {
      COMPRA_VENDA: 'Compra e Venda',
      DOACAO: 'Doação',
      PERMUTA: 'Permuta',
      DIVORCIO: 'Divórcio',
      INVENTARIO: 'Inventário',
      USUCAPIAO: 'Usucapião',
      ATA_NOTARIAL: 'Ata Notarial',
      PROCURACAO: 'Procuração',
      REVOGACAO: 'Revogação de Procuração',
      TESTAMENTO: 'Testamento',
      RECONHECIMENTO_FIRMA: 'Reconhecimento de Firma',
      AUTENTICACAO: 'Autenticação',
      APOSTILAMENTO: 'Apostilamento',
      CERTIDAO: 'Certidão',
    };
    return serviceNames;
  }
}
