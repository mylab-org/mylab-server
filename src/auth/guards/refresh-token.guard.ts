import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_ERROR } from '../constants/auth.error.js';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh_token') {
  handleRequest<T>(err: Error | null, user: T, info: Error | null): T {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_EXPIRED);
    }

    if (info?.name === 'JsonWebTokenError' || !user) {
      throw new UnauthorizedException(AUTH_ERROR.REFRESH_TOKEN_MISSING);
    }

    if (err) {
      throw err;
    }

    return user;
  }
}
