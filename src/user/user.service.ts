import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserRequestDto } from './dto/request/create-user.request.dto.js';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import * as bcrypt from 'bcrypt';
import { USER_ERROR } from './constants/user.error.js';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto.js';
import { ChangePhoneRequestDto } from './dto/request/change-phone.request.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    username: true,
    phone: true,
    name: true,
    degree: true,
    professor_email: true,
    professor_status: true,
    created_at: true,
    updated_at: true,
  };

  async register(dto: CreateUserRequestDto) {
    const existing = await this.prisma.users.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { phone: dto.phone },
          ...(dto.professorEmail ? [{ professor_email: dto.professorEmail }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.username === dto.username) {
        throw new CommonException(USER_ERROR.DUPLICATE_USERNAME);
      }
      if (existing.phone === dto.phone) {
        throw new CommonException(USER_ERROR.DUPLICATE_PHONE);
      }
      if (existing.professor_email === dto.professorEmail) {
        throw new CommonException(USER_ERROR.DUPLICATE_EMAIL);
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const isProfessor = dto.degree === 'PROFESSOR';

    return this.prisma.users.create({
      data: {
        username: dto.username,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        degree: dto.degree,
        professor_email: isProfessor ? dto.professorEmail : null,
        professor_status: isProfessor ? 'PENDING' : 'NONE',
      },
      select: this.userSelect,
    });
  }

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
      select: { id: true },
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
      throw new CommonException(USER_ERROR.IS_NOT_MATCHED_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.users.update({
      where: { id: BigInt(id) },
      data: { password: hashedPassword },
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

  async deleteUser(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: this.userSelect,
    });

    if (!user) {
      throw new CommonException(USER_ERROR.NOT_FOUND);
    }

    return this.prisma.users.delete({
      where: { id: BigInt(id) },
    });
  }
}
