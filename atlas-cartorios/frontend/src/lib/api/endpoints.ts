export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
  },
  PERMISSIONS: {
    BASE: '/permissions',
  },
  PEOPLE: {
    BASE: '/people',
    BY_ID: (id: string) => `/people/${id}`,
  },
  PROPERTIES: {
    BASE: '/properties',
    BY_ID: (id: string) => `/properties/${id}`,
  },
  PROTOCOLS: {
    BASE: '/protocols',
    BY_ID: (id: string) => `/protocols/${id}`,
    CONCLUDE: (id: string) => `/protocols/${id}/conclude`,
    CANCEL: (id: string) => `/protocols/${id}/cancel`,
  },
  SERVICES: {
    BASE: '/services',
    BY_ID: (id: string) => `/services/${id}`,
  },
  CHECKLIST: {
    BASE: '/checklist',
    BY_PROTOCOL: (protocolId: string) => `/checklist/protocol/${protocolId}`,
    UPDATE_ITEM: (itemId: string) => `/checklist/items/${itemId}`,
  },
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },
  RULES: {
    BASE: '/rules-engine/rules',
    BY_ID: (id: string) => `/rules-engine/rules/${id}`,
    EVALUATE: '/rules-engine/evaluate',
  },
  SISCOAF: {
    INDICATORS: '/siscoaf/indicators',
    INDICATOR_BY_ID: (id: string) => `/siscoaf/indicators/${id}`,
    ANALYSES: '/siscoaf/analyses',
    ANALYSIS_BY_ID: (id: string) => `/siscoaf/analyses/${id}`,
    PARAMETERS: '/siscoaf/parameters',
    EVALUATE: '/siscoaf/evaluate',
  },
  DECISION_TREE: {
    BASE: '/decision-tree',
    BY_ID: (id: string) => `/decision-tree/${id}`,
    EVALUATE: (id: string) => `/decision-tree/${id}/evaluate`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    MONTHLY: '/dashboard/monthly',
    ESCREVENTES: '/dashboard/escreventes',
    SERVICES: '/dashboard/services',
  },
  REPORTS: {
    BASE: '/reports',
    GENERATE: '/reports/generate',
  },
  AUDIT: {
    BASE: '/audit',
    STATS: '/audit/stats',
  },
  FINANCE: {
    BASE: '/finance',
    SUMMARY: '/finance/summary',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
};
