import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import * as bcrypt from 'bcrypt';
import { USER_ERROR } from './constants/user.error.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';

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
      select: this.userSelect,
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return user;
  }

  async updateProfile(id: number, dto: UpdateUserRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return this.prisma.users.update({
      where: { id: BigInt(id) },
      data: dto,
      select: this.userSelect,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    await this.prisma.users.delete({
      where: { id: BigInt(id) },
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

    await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: {
        password: hashedPassword,
        refresh_token: null, // 비밀번호 변경 시 모든 기기 로그아웃 처리
      },
    });

    return { message: '비밀번호가 변경되었습니다' };
  }
}
