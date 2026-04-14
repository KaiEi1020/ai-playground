import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Role } from './constants/roles';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'demo-jwt-secret',
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    role: Role;
    permissions: string[];
  }) {
    return this.authService.validateTokenPayload(payload);
  }
}
