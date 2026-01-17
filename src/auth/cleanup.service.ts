import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private prisma: PrismaService) {}

  // 매일 새벽 3시 실행
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupUnverifiedUsers() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        await tx.auth_tokens.deleteMany({
          where: {
            users: {
              is_email_verified: false,
              created_at: { lt: oneWeekAgo },
            },
          },
        });

        return tx.users.deleteMany({
          where: {
            is_email_verified: false,
            created_at: { lt: oneWeekAgo },
          },
        });
      });

      this.logger.log(`${result.count}명의 미인증 유저 삭제 완료`);
    } catch (error) {
      this.logger.error('미인증 유저 정리 실패', error);
    }
  }
}
