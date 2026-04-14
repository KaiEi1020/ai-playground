import { ForbiddenException } from '@nestjs/common';

export function ensurePermission(
  permissions: string[],
  requiredPermission: string,
): void {
  if (permissions.includes('*') || permissions.includes(requiredPermission)) {
    return;
  }

  throw new ForbiddenException('Insufficient permissions.');
}
