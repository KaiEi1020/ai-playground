export const Permission = {
  USERS: {
    READ: 'users:read',
    CREATE: 'users:create',
    FREEZE: 'users:freeze',
  },
  ORDERS: {
    READ: 'orders:read',
    CREATE: 'orders:create',
    START: 'orders:start',
  },
  PRODUCTS: {
    READ: 'products:read',
    CREATE: 'products:create',
  },
  ADDRESSES: {
    READ: 'addresses:read',
    CREATE: 'addresses:create',
  },
  MARKETING_CAMPAIGNS: {
    READ: 'marketing-campaigns:read',
    CREATE: 'marketing-campaigns:create',
    UPDATE: 'marketing-campaigns:update',
    DELETE: 'marketing-campaigns:delete',
  },
} as const;

export type PermissionValue = string;
