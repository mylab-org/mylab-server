import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_ERROR } from '../constants/auth.error.js';

@Injectable()
export class AccessTokenGuard extends AuthGuard('access_token') {
  handleRequest<T>(err: Error | null, user: T, info: Error | null): T {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(AUTH_ERROR.ACCESS_TOKEN_EXPIRED);
    }

    if (info?.name === 'JsonWebTokenError' || !user) {
      throw new UnauthorizedException(AUTH_ERROR.ACCESS_TOKEN_MISSING);
    }

    if (err) {
      throw err;
    }

    return user;
  }
}
