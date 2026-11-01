import { Module } from '@nestjs/common';
import { PaperModule } from '../paper/paper.module.js';
import { TaskController } from './task.controller.js';
import { TaskService } from './task.service.js';

@Module({
  imports: [PaperModule],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
