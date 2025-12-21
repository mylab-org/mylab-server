import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as process from 'node:process';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { VERIFY_ERROR } from './constants/verification.error.js';
import { getEmailVerificationTemplate } from './templates/email-verification.template.js';
import { VERIFICATION_TYPE } from './constants/verification.constants.js';

@Injectable()
export class VerificationService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  constructor(private prisma: PrismaService) {}

  async sendEmailVerification(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        name: true,
        professor_email: true,
        professor_status: true,
      },
    });

    if (!user) {
      throw new CommonException(VERIFY_ERROR.USER_NOT_FOUND);
    }

    if (!user.professor_email || user.professor_status === 'NONE') {
      throw new CommonException(VERIFY_ERROR.NOT_PROFESSOR);
    }

    if (user.professor_status === 'VERIFIED') {
      throw new CommonException(VERIFY_ERROR.ALREADY_VERIFIED);
    }

    const lastToken = await this.prisma.verification_tokens.findFirst({
      where: {
        user_id: BigInt(userId),
        type: VERIFICATION_TYPE.EMAIL,
      },
      orderBy: { created_at: 'desc' },
    });

    if (lastToken) {
      const diff = Date.now() - lastToken.created_at.getTime();
      if (diff < 60 * 1000) {
        throw new CommonException(VERIFY_ERROR.TOO_MANY_REQUESTS);
      }
    }

    await this.prisma.verification_tokens.deleteMany({
      where: {
        user_id: BigInt(userId),
        type: VERIFICATION_TYPE.EMAIL,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.verification_tokens.create({
      data: {
        user_id: BigInt(userId),
        type: VERIFICATION_TYPE.EMAIL,
        token: token,
        expires_at: expiresAt,
      },
    });

    const verifyUrl = `${process.env.CLIENT_URL}/api/verify/email?token=${token}`;

    await this.transporter.sendMail({
      from: `"MyLab" <${process.env.SMTP_USER}>`,
      to: user.professor_email,
      subject: '[MyLab] 교수 이메일 인증을 완료해주세요',
      html: getEmailVerificationTemplate(user.name, verifyUrl),
    });

    return { message: '인증 메일이 발송되었습니다' };
  }

  async verifyEmail(token: string) {
    const verification = await this.prisma.verification_tokens.findUnique({
      where: { token: token },
    });

    if (!verification) {
      throw new CommonException(VERIFY_ERROR.INVALID_TOKEN);
    }
    if (verification.expires_at < new Date()) {
      await this.prisma.verification_tokens.delete({
        where: { id: verification.id },
      });
      throw new CommonException(VERIFY_ERROR.TOKEN_EXPIRED);
    }

    await this.prisma.users.update({
      where: { id: verification.user_id },
      data: { professor_status: 'VERIFIED' },
    });

    await this.prisma.verification_tokens.delete({
      where: { id: verification.id },
    });

    return { message: '이메일 인증이 완료되었습니다' };
  }
}
