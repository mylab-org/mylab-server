import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AccessTokenGuard } from './guards/access-token.guard.js';
import { AccessTokenStrategy } from './strategies/access-token.strategy.js';
import { PassportModule } from '@nestjs/passport';
import { EXPIRES_IN, JWT_ACCESS_SECRET } from './constants/jwt.config.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy.js';
import { VerificationModule } from '../verification/verification.module.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: EXPIRES_IN.JWT_ACCESS_TOKEN },
    }),
    VerificationModule,
  ],
  providers: [
    AuthService,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, AccessTokenGuard],
})
export class AuthModule {}
