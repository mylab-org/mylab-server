import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET } from '../constants/jwt.config.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET as string,
    });
  }

  validate(payload: { sub: string }) {
    // JWT의 sub는 문자열이므로, 숫자로 변환해 req.user.userId 타입(number)과 실제 값을 맞춥니다.
    return { userId: Number(payload.sub) };
  }
}
