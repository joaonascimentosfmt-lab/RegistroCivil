export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard:view',
  },
  PEOPLE: {
    CREATE: 'people:create',
    READ: 'people:read',
    UPDATE: 'people:update',
    DELETE: 'people:delete',
  },
  PROPERTIES: {
    CREATE: 'properties:create',
    READ: 'properties:read',
    UPDATE: 'properties:update',
    DELETE: 'properties:delete',
  },
  PROTOCOLS: {
    CREATE: 'protocols:create',
    READ: 'protocols:read',
    UPDATE: 'protocols:update',
    DELETE: 'protocols:delete',
    CANCEL: 'protocols:cancel',
    CONCLUDE: 'protocols:conclude',
  },
  DOCUMENTS: {
    UPLOAD: 'documents:upload',
    READ: 'documents:read',
    DELETE: 'documents:delete',
  },
  SISCOAF: {
    VIEW: 'siscoaf:view',
    ANALYZE: 'siscoaf:analyze',
    CONFIGURE: 'siscoaf:configure',
    COMMUNICATE: 'siscoaf:communicate',
  },
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  ROLES: {
    MANAGE: 'roles:manage',
  },
  AUDIT: {
    VIEW: 'audit:view',
    EXPORT: 'audit:export',
  },
  REPORTS: {
    VIEW: 'reports:view',
    EXPORT: 'reports:export',
  },
  FINANCE: {
    VIEW: 'finance:view',
    MANAGE: 'finance:manage',
  },
  SETTINGS: {
    MANAGE: 'settings:manage',
  },
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
