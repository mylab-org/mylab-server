import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/request/login.request.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { AUTH_ERROR } from './constants/auth.error.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as process from 'node:process';
import { EXPIRES_IN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './constants/jwt.config.js';
import { RegisterRequestDto } from './dto/request/register.request.dto.js';
import { ResendVerificationDto } from './dto/request/resend-verification.dto.js';
import { getEmailVerificationTemplate } from './templates/email-verification.template.js';
import nodemailer from 'nodemailer';
import { Prisma, TokenType } from '@prisma/client';
import { RateLimitService } from './rate-limit.service.js';

@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private rateLimitService: RateLimitService,
  ) {}

  async register(dto: RegisterRequestDto) {
    await this.rateLimitService.checkEmailRateLimit(dto.email);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const { user, token } = await this.prisma.$transaction(
        async (tx) => {
          const existingUser = await tx.users.findUnique({
            where: { email: dto.email },
          });

          if (existingUser?.is_email_verified) {
            throw new CommonException(AUTH_ERROR.DUPLICATE_EMAIL);
          }

          const user = existingUser
            ? await tx.users.update({
                where: { id: existingUser.id },
                data: {
                  password: hashedPassword,
                  name: dto.name,
                  degree: dto.degree,
                },
              })
            : await tx.users.create({
                data: {
                  email: dto.email,
                  password: hashedPassword,
                  name: dto.name,
                  degree: dto.degree,
                  is_email_verified: false,
                },
              });

          await tx.auth_tokens.deleteMany({
            where: {
              user_id: user.id,
              type: TokenType.EMAIL_VERIFY,
            },
          });

          const verifyTokenString = crypto.randomBytes(32).toString('hex');
          const verifyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

          const token = await tx.auth_tokens.create({
            data: {
              user_id: user.id,
              type: TokenType.EMAIL_VERIFY,
              token: verifyTokenString,
              expires_at: verifyExpiresAt,
            },
          });

          return { user, token };
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );

      this.sendVerificationEmail(user.email, user.name, token.token).catch(() => {});

      return {
        message: '가입이 완료되었습니다. 이메일 인증을 진행해주세요.',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new CommonException(AUTH_ERROR.DUPLICATE_EMAIL);
      }
      throw error;
    }
  }

  async verifyEmail(token: string) {
    const authToken = await this.prisma.auth_tokens.findUnique({
      where: { token },
      include: { users: true },
    });

    if (
      !authToken ||
      authToken.type !== TokenType.EMAIL_VERIFY ||
      authToken.expires_at < new Date()
    ) {
      if (authToken) {
        await this.prisma.auth_tokens.delete({ where: { id: authToken.id } });
      }
      throw new CommonException(AUTH_ERROR.INVALID_OR_EXPIRED_TOKEN);
    }

    if (authToken.users.is_email_verified) {
      await this.prisma.auth_tokens.delete({ where: { id: authToken.id } });
      return { message: '이미 인증된 사용자입니다.' };
    }

    await this.prisma.$transaction(
      async (tx) => {
        await tx.users.update({
          where: { id: authToken.user_id },
          data: { is_email_verified: true },
        });

        await tx.auth_tokens.delete({
          where: { id: authToken.id },
        });

        await tx.auth_tokens.deleteMany({
          where: {
            user_id: authToken.user_id,
            type: TokenType.EMAIL_VERIFY,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return { message: '이메일 인증이 완료되었습니다. 로그인해주세요.' };
  }

  async resendVerificationEmail(dto: ResendVerificationDto) {
    await this.rateLimitService.checkEmailRateLimit(dto.email);

    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new CommonException(AUTH_ERROR.USER_NOT_FOUND);
    }

    if (user.is_email_verified) {
      throw new CommonException(AUTH_ERROR.ALREADY_VERIFIED);
    }

    const newToken = await this.createAuthToken(user.id, TokenType.EMAIL_VERIFY);

    await this.sendVerificationEmail(user.email, user.name, newToken.token);

    return { message: '인증 메일이 재발송되었습니다.' };
  }

  async login(dto: LoginRequestDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    const isPasswordValid = user
      ? await bcrypt.compare(dto.password, user.password)
      : await bcrypt.compare(dto.password, '$2b$10$dummyhashfortimingattackprevention1234567890');

    if (!user || !isPasswordValid) {
      throw new CommonException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    if (!user.is_email_verified) {
      throw new CommonException(AUTH_ERROR.EMAIL_NOT_VERIFIED);
    }

    const tokens = await this.generateTokens(user.id.toString());
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        degree: user.degree,
      },
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.users.update({
      where: { id: BigInt(userId) },
      data: { refresh_token: null },
    });

    return { message: '로그아웃 되었습니다.' };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: { id: true },
    });

    if (!user) {
      throw new CommonException(AUTH_ERROR.USER_NOT_FOUND);
    }

    const tokens = await this.generateTokens(user.id.toString());
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens };
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: { refresh_token: true },
    });

    if (!user || !user.refresh_token) {
      return false;
    }

    return bcrypt.compare(refreshToken, user.refresh_token);
  }

  private async createAuthToken(userId: bigint, type: TokenType) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return this.prisma.$transaction(
      async (tx) => {
        await tx.auth_tokens.deleteMany({
          where: {
            user_id: userId,
            type: type,
          },
        });

        return tx.auth_tokens.create({
          data: {
            user_id: userId,
            type: type,
            token: token,
            expires_at: expiresAt,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );
  }

  private async generateTokens(userId: string) {
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

  private async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyUrl = `${process.env.CLIENT_URL}/verify/email?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: `"MyLab" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '[MyLab] 이메일 인증을 완료해주세요',
        html: getEmailVerificationTemplate(name, verifyUrl),
      });
    } catch (e) {
      console.error('Email send failed:', e);
      throw new CommonException(AUTH_ERROR.EMAIL_SEND_FAILED);
    }
  }
}
