import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { AUTH_ERROR } from './constants/auth.error.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EXPIRES_IN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './constants/jwt.config.js';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  private async generateToken(payload: { sub: number; username: string; phone: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: EXPIRES_IN.JWT_ACCESS_TOKEN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: EXPIRES_IN.JWT_REFRESH_TOKEN,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: bigint, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: hashedRefreshToken },
    });
  }

  async register(dto: RegisterRequestDto) {
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
        throw new CommonException(AUTH_ERROR.DUPLICATE_USERNAME);
      }
      if (existing.phone === dto.phone) {
        throw new CommonException(AUTH_ERROR.DUPLICATE_PHONE);
      }
      if (existing.professor_email === dto.professorEmail) {
        throw new CommonException(AUTH_ERROR.DUPLICATE_EMAIL);
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

  async login(dto: LoginRequestDto) {
    if (!dto.username && !dto.phone) {
      throw new CommonException(AUTH_ERROR.USERNAME_OR_PHONE_REQUIRED);
    }

    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { phone: dto.phone }],
      },
    });

    if (!user) {
      throw new CommonException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new CommonException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    const payload = { sub: Number(user.id), username: user.username, phone: user.phone };
    const tokens = await this.generateToken(payload);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { refresh_token: null },
    });

    return { message: '로그아웃 되었습니다' };
  }

  async validateRefreshToken(userId: number, refreshToken: string | undefined): Promise<boolean> {
    if (!refreshToken) return false;

    const user = await this.prisma.users.findFirst({
      where: { id: BigInt(userId) },
      select: { refresh_token: true },
    });

    if (!user?.refresh_token) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.refresh_token);
  }

  async refreshToken(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true, username: true, phone: true },
    });

    if (!user) {
      throw new CommonException(AUTH_ERROR.USER_NOT_FOUND);
    }

    const payload = { sub: Number(user.id), username: user.username, phone: user.phone };
    const tokens = await this.generateToken(payload);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
