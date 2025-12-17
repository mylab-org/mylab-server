import { Module } from '@nestjs/common';
import { LabService } from './lab.service.js';
import { LabController } from './lab.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [LabService],
  controllers: [LabController],
})
export class LabModule {}
