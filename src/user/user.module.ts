import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { PaperModule } from '../paper/paper.module.js';
import { TaskModule } from '../task/task.module.js';

@Module({
  imports: [AuthModule, PaperModule, TaskModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
