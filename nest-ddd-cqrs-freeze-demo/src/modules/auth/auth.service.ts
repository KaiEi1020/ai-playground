import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, RolePermissions } from './constants/roles';
import { AuthenticatedUser } from './types/authenticated-user.interface';

interface DemoAccount {
  userId: string;
  username: string;
  password: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private readonly accounts: DemoAccount[] = [
    {
      userId: '00000000-0000-0000-0000-000000000001',
      username: 'admin',
      password: 'admin123',
      role: Role.ADMIN,
    },
    {
      userId: '00000000-0000-0000-0000-000000000002',
      username: 'ops',
      password: 'ops123',
      role: Role.OPERATIONS,
    },
    {
      userId: '00000000-0000-0000-0000-000000000003',
      username: 'marketing',
      password: 'marketing123',
      role: Role.MARKETING,
    },
    {
      userId: '00000000-0000-0000-0000-000000000004',
      username: 'viewer',
      password: 'viewer123',
      role: Role.VIEWER,
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const account = this.accounts.find(
      (candidate) =>
        candidate.username === username && candidate.password === password,
    );

    if (!account) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const user = this.toAuthenticatedUser(account);
    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    });

    return {
      accessToken,
      user,
    };
  }

  validateTokenPayload(payload: {
    sub: string;
    username: string;
    role: Role;
    permissions: string[];
  }): AuthenticatedUser {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      permissions: payload.permissions,
    };
  }

  private toAuthenticatedUser(account: DemoAccount): AuthenticatedUser {
    return {
      userId: account.userId,
      username: account.username,
      role: account.role,
      permissions: RolePermissions[account.role],
    };
  }
}
