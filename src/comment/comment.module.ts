import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller.js';
import { CommentService } from './comment.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
