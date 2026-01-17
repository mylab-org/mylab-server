import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CommonException } from '../common/exceptions/common.exception.js';
import type { Cache } from 'cache-manager';
import { AUTH_ERROR } from './constants/auth.error.js';

@Injectable()
export class RateLimitService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async checkEmailRateLimit(email: string): Promise<void> {
    const minuteKey = `email:${email}:minute`;
    const dailyKey = `email:${email}:daily`;

    const minuteCount = (await this.cacheManager.get<number>(minuteKey)) || 0;
    if (minuteCount >= 1) {
      throw new CommonException(AUTH_ERROR.TOO_MANY_REQUESTS);
    }
    await this.cacheManager.set(minuteKey, minuteCount + 1, 60 * 1000); // 60초

    const dailyCount = (await this.cacheManager.get<number>(dailyKey)) || 0;
    if (dailyCount >= 5) {
      throw new CommonException(AUTH_ERROR.DAILY_LIMIT_EXCEEDED);
    }
    await this.cacheManager.set(dailyKey, dailyCount + 1, 24 * 60 * 60 * 1000); // 24시간
  }
}
