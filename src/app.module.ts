import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LabModule } from './lab/lab.module.js';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';
import { BoardModule } from './board/board.module.js';
import { CommentModule } from './comment/comment.module.js';
import { CalendarModule } from './calendar/calendar.module.js';
import { PaperModule } from './paper/paper.module.js';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    LabModule,
    BoardModule,
    CommentModule,
    CalendarModule,
    PaperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
