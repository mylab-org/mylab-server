import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_SECRET } from '../constants/jwt.config.js';
import { AuthService } from '../auth.service.js';
import { AUTH_ERROR } from '../constants/auth.error.js';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: number }) {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader?.split(' ')[1];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_MISSING);
    }

    const isValid = await this.authService.validateRefreshToken(payload.sub, refreshToken);

    if (!isValid) {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_INVALID);
    }

    return {
      userId: payload.sub,
    };
  }
}
