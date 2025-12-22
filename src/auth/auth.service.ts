import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { AUTH_ERROR } from './constants/auth.error.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EXPIRES_IN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './constants/jwt.config.js';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';
import { userSelect } from '../user/constants/user.select.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterRequestDto) {
    const existing = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { phone: dto.phone }],
      },
    });

    if (existing) {
      if (existing.username === dto.username) {
        throw new CommonException(AUTH_ERROR.DUPLICATE_USERNAME);
      }
      if (existing.phone === dto.phone) {
        throw new CommonException(AUTH_ERROR.DUPLICATE_PHONE);
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        username: dto.username,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
      },
      select: userSelect,
    });

    const tokens = await this.generateTokens(Number(user.id));

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
    };
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

    const tokens = await this.generateTokens(Number(user.id));
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const userResponse = await this.prisma.users.findUnique({
      where: { id: user.id },
      select: userSelect,
    });

    return {
      user: userResponse,
      ...tokens,
    };
  }

  async logout(userId: number) {
    await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { refresh_token: null },
    });

    return { message: '로그아웃 되었습니다' };
  }

  async refreshToken(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true, username: true, phone: true },
    });

    if (!user) {
      throw new CommonException(AUTH_ERROR.USER_NOT_FOUND);
    }

    const tokens = await this.generateTokens(Number(user.id));
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
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

  private async generateTokens(userId: number) {
    const payload = { sub: userId };

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
}
