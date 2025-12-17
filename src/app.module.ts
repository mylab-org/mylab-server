import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthService } from './auth/auth.service.js';
import { LabModule } from './lab/lab.module.js';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, LabModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
