import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET } from '../constants/jwt.config.js';

interface Payload {
  sub: number;
  username: string;
  phone: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET as string,
    });
  }

  validate(payload: Payload) {
    return {
      userId: payload.sub,
      username: payload.username,
      phone: payload.phone,
    };
  }
}
