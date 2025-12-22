import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import * as bcrypt from 'bcrypt';
import { USER_ERROR } from './constants/user.error.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { ChangePhoneRequestDto } from './dto/request/change-phone.request.dto.js';
import { userSelect } from './constants/user.select.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: userSelect,
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return user;
  }

  async updateProfile(id: number, dto: UpdateUserRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: { id: true },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return this.prisma.users.update({
      where: { id: BigInt(id) },
      data: dto,
      select: userSelect,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: userSelect,
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return { message: '회원 탈퇴가 완료되었습니다' };
  }

  async changePassword(id: number, dto: ChangePasswordRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: { id: true, password: true },
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
      data: { password: hashedPassword, refresh_token: null },
    });

    return { message: '비밀번호가 변경되었습니다' };
  }

  async changePhone(id: number, dto: ChangePhoneRequestDto) {
    const existing = await this.prisma.users.findUnique({
      where: { phone: dto.phone },
    });

    if (existing && existing.id !== BigInt(id)) {
      throw new CommonException(USER_ERROR.DUPLICATE_PHONE);
    }

    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: { id: true, phone: true },
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: { phone: dto.phone },
    });

    return { message: '전화번호가 변경되었습니다' };
  }
}
