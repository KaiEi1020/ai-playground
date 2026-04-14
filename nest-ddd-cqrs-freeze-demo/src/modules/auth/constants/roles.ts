import { PermissionValue } from './permissions';

export enum Role {
  ADMIN = 'admin',
  OPERATIONS = 'operations',
  MARKETING = 'marketing',
  VIEWER = 'viewer',
}

export const RolePermissions: Record<Role, PermissionValue[]> = {
  [Role.ADMIN]: ['*' as PermissionValue],
  [Role.OPERATIONS]: [
    'users:read',
    'users:create',
    'users:freeze',
    'orders:read',
    'orders:create',
    'orders:start',
    'products:read',
    'addresses:read',
    'addresses:create',
  ],
  [Role.MARKETING]: [
    'products:read',
    'marketing-campaigns:create',
    'marketing-campaigns:update',
    'marketing-campaigns:read',
  ],
  [Role.VIEWER]: [
    'users:read',
    'orders:read',
    'products:read',
    'addresses:read',
    'marketing-campaigns:read',
  ],
};
