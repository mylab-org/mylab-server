import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserStatus } from '@prisma/client';
import { USER_ERROR } from './constants/user.error.js';
import { WITHDRAWN_USER_NAME } from './constants/user.constant.js';
import { LAB_STATUS } from '../lab/constants/lab-status.constant.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { WithdrawUserRequestDto } from './dto/request/withdraw-user.request.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    degree: true,
    is_email_verified: true,
    created_at: true,
    updated_at: true,
  };

  async getProfile(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: {
        ...this.userSelect,
        lab_members: {
          where: { left_at: null },
          take: 1,
          select: {
            role: true,
            labs: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    const { lab_members, ...profile } = user;
    const membership = lab_members[0];

    return {
      ...profile,
      lab: membership
        ? {
            labId: Number(membership.labs.id),
            labName: membership.labs.name,
            role: membership.role,
          }
        : null,
    };
  }

  async updateProfile(id: number, dto: UpdateUserRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    if (dto.degree) {
      if (user?.degree === 'PROFESSOR') {
        throw new CommonException(USER_ERROR.DEGREE_CHANGE_NOT_ALLOWED);
      }

      if (dto?.degree === 'PROFESSOR') {
        throw new CommonException(USER_ERROR.DEGREE_TO_PROFESSOR_NOT_ALLOWED);
      }
    }

    return this.prisma.users.update({
      where: { id: BigInt(id) },
      data: dto,
      select: this.userSelect,
    });
  }

  async withdrawUser(id: number, dto: WithdrawUserRequestDto) {
    const userId = BigInt(id);

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true, status: true },
    });

    if (!user || user.status === UserStatus.WITHDRAWN) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new CommonException(USER_ERROR.PASSWORD_NOT_MATCHED);
    }

    const ownedLabs = await this.prisma.labs.findMany({
      where: { professor_id: userId },
      select: { id: true },
    });
    const ownedLabIds = ownedLabs.map((lab) => lab.id);

    if (ownedLabIds.length > 0) {
      const remainingMemberCount = await this.prisma.lab_members.count({
        where: {
          lab_id: { in: ownedLabIds },
          user_id: { not: userId },
          left_at: null,
        },
      });

      if (remainingMemberCount > 0) {
        throw new CommonException(USER_ERROR.LAB_HAS_REMAINING_MEMBERS);
      }
    }

    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: userId },
        data: {
          status: UserStatus.WITHDRAWN,
          deleted_at: now,
          email: `deleted_${id}_${user.email}`,
          name: WITHDRAWN_USER_NAME,
          password: crypto.randomBytes(32).toString('hex'),
        },
      });

      await tx.refresh_tokens.deleteMany({ where: { user_id: userId } });
      await tx.auth_tokens.deleteMany({ where: { user_id: userId } });
      await tx.device_tokens.deleteMany({ where: { user_id: userId } });

      await tx.lab_members.updateMany({
        where: { user_id: userId, left_at: null },
        data: { left_at: now },
      });

      if (ownedLabIds.length > 0) {
        await tx.labs.updateMany({
          where: { id: { in: ownedLabIds } },
          data: { status: LAB_STATUS.CLOSED },
        });

        await tx.invite_codes.updateMany({
          where: { lab_id: { in: ownedLabIds }, is_active: true },
          data: { is_active: false },
        });
      }
    });

    return { message: '회원 탈퇴가 완료되었습니다' };
  }

  async changePassword(id: number, dto: ChangePasswordRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new CommonException(USER_ERROR.PASSWORD_NOT_MATCHED);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.users.update({
        where: { id: BigInt(id) },
        data: { password: hashedPassword },
      }),
      // 비밀번호 변경 시 모든 기기 로그아웃 처리
      this.prisma.refresh_tokens.deleteMany({ where: { user_id: BigInt(id) } }),
    ]);

    return { message: '비밀번호가 변경되었습니다' };
  }
}
