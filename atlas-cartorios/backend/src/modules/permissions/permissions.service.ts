import { Injectable } from '@nestjs/common';
import { PERMISSIONS } from '../../common/constants/permissions.constant';

@Injectable()
export class PermissionsService {
  findAll() {
    const categories = [];
    for (const [category, perms] of Object.entries(PERMISSIONS)) {
      const permissions = Object.entries(perms).map(([key, value]) => ({
        key,
        value,
        description: this.getDescription(category, key),
      }));
      categories.push({
        category,
        permissions,
      });
    }
    return categories;
  }

  private getDescription(category: string, key: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      DASHBOARD: { VIEW: 'Visualizar dashboard' },
      PEOPLE: {
        CREATE: 'Criar pessoas',
        READ: 'Visualizar pessoas',
        UPDATE: 'Editar pessoas',
        DELETE: 'Excluir pessoas',
      },
      PROPERTIES: {
        CREATE: 'Criar imóveis',
        READ: 'Visualizar imóveis',
        UPDATE: 'Editar imóveis',
        DELETE: 'Excluir imóveis',
      },
      PROTOCOLS: {
        CREATE: 'Criar protocolos',
        READ: 'Visualizar protocolos',
        UPDATE: 'Editar protocolos',
        DELETE: 'Excluir protocolos',
        CANCEL: 'Cancelar protocolos',
        CONCLUDE: 'Concluir protocolos',
      },
      DOCUMENTS: {
        UPLOAD: 'Upload de documentos',
        READ: 'Visualizar documentos',
        DELETE: 'Excluir documentos',
      },
      SISCOAF: {
        VIEW: 'Visualizar SISCOAF',
        ANALYZE: 'Realizar análise SISCOAF',
        CONFIGURE: 'Configurar SISCOAF',
        COMMUNICATE: 'Comunicar ao COAF',
      },
      USERS: {
        CREATE: 'Criar usuários',
        READ: 'Visualizar usuários',
        UPDATE: 'Editar usuários',
        DELETE: 'Excluir usuários',
      },
      ROLES: { MANAGE: 'Gerenciar perfis' },
      AUDIT: {
        VIEW: 'Visualizar auditoria',
        EXPORT: 'Exportar auditoria',
      },
      REPORTS: {
        VIEW: 'Visualizar relatórios',
        EXPORT: 'Exportar relatórios',
      },
      FINANCE: {
        VIEW: 'Visualizar financeiro',
        MANAGE: 'Gerenciar financeiro',
      },
      SETTINGS: { MANAGE: 'Gerenciar configurações' },
    };
    return descriptions[category]?.[key] || '';
  }
}
