import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_SECRET } from '../constants/jwt.config.js';
import { AuthService } from '../auth.service.js';
import { AUTH_ERROR } from '../constants/auth.error.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants/refresh-token-cookie.constant.js';
import { Request } from 'express';

// TODO: 앱(RN)은 쿠키 관리가 달라서 나중에 body/헤더도 같이 받을지 고민
const extractRefreshTokenFromCookie = (req: Request): string | null =>
  (req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as string | undefined) ?? null;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: JWT_REFRESH_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refreshToken = extractRefreshTokenFromCookie(req);

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_MISSING);
    }

    const isValid = await this.authService.validateRefreshToken(payload.sub, refreshToken);

    if (!isValid) {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_INVALID);
    }

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
