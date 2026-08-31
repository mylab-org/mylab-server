import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PaperController } from './paper.controller.js';
import { PaperService } from './paper.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaperController],
  providers: [PaperService],
})
export class PaperModule {}
