import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { LAB_ERRORS } from './lab.error.js';
import { CreateLabRequestDto } from './dto/request/create-lab.request.dto.js';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  async create(professorId: number, dto: CreateLabRequestDto) {
    // 교수 인증 상태 확인
    const user = await this.prisma.users.findUnique({
      where: { id: professorId },
    });

    if (!user) {
      throw new CommonException(LAB_ERRORS.USER_NOT_FOUND);
    }

    if (user.professor_status == 'PENDING') {
      throw new CommonException(LAB_ERRORS.NOT_VERIFIED_PROFESSOR_PENDING);
    }

    if (user.professor_status !== 'VERIFIED') {
      throw new CommonException(LAB_ERRORS.NOT_VERIFIED_PROFESSOR);
    }

    // 연구실 중복 소속 확인
    const isUserExistingLab = await this.prisma.lab_members.findFirst({
      where: { id: professorId, left_at: null },
    });

    if (isUserExistingLab) {
      throw new CommonException(LAB_ERRORS.ALREADY_IN_LAB);
    }

    return this.prisma.$transaction(async (tx) => {
      const lab = await tx.labs.create({
        data: {
          name: dto.labName,
          school_name: dto.schoolName,
          department_name: dto.departmentName,
          professor_id: professorId,
        },
      });

      await tx.lab_members.create({
        data: {
          user_id: professorId,
          lab_id: lab.id,
          role: 'PROFESSOR',
        },
      });

      return lab;
    });
  }
}
