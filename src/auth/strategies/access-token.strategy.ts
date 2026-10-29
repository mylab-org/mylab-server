import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStatus } from '@prisma/client';
import { JWT_ACCESS_SECRET } from '../constants/jwt.config.js';
import { AUTH_ERROR } from '../constants/auth.error.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET as string,
    });
  }

  async validate(payload: { sub: string }) {
    const userId = Number(payload.sub);

    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: { status: true },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(AUTH_ERROR.WITHDRAWN_ACCOUNT);
    }

    return { userId };
  }
}
