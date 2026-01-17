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
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { RateLimitService } from './rate-limit.service.js';
import { CleanupService } from './cleanup.service.js';

@Module({
  imports: [
    PassportModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: JWT_ACCESS_SECRET,
      signOptions: { expiresIn: EXPIRES_IN.JWT_ACCESS_TOKEN },
    }),
  ],
  providers: [
    AuthService,
    AccessTokenGuard,
    AccessTokenStrategy,
    RefreshTokenGuard,
    RefreshTokenStrategy,
    RateLimitService,
    CleanupService,
  ],
  controllers: [AuthController],
  exports: [AuthService, AccessTokenGuard],
})
export class AuthModule {}
