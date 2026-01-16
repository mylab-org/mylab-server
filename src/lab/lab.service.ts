import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommonException } from '../common/exceptions/common.exception.js';
import { LAB_ERRORS } from './constants/lab.error.js';
import { CreateLabRequestDto } from './dto/request/create-lab.request.dto.js';
import { CreateInviteCodeRequestDto } from './dto/request/create-invite-code.request.dto.js';
import { CreateLabResponseDto } from './dto/response/create-lab.response.dto.js';
import { InviteCodeResponseDto } from './dto/response/invite-code.response.dto.js';
import { ValidateInviteCodeResponseDto } from './dto/response/validate-invite-code.response.dto.js';
import { randomUUID } from 'node:crypto';
import { invite_codes, Prisma } from '../../generated/prisma/client.js';
import { JoinLabRequestDto } from './dto/request/join-lab.request.dto.js';
import { JoinLabResponseDto } from './dto/response/join-lab.response.dto.js';

type PrismaClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  // 신규 연구실 생성 요청
  async createLab(professorId: number, dto: CreateLabRequestDto): Promise<CreateLabResponseDto> {
    await this.chkVerifiedProfessor(professorId);
    await this.chkUserNotExistInLab(professorId);

    const lab = await this.prisma.$transaction(async (tx) => {
      const lab = await tx.labs.create({
        data: {
          name: dto.labName,
          university_name: dto.universityName,
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

    return {
      labId: Number(lab.id),
      labName: lab.name,
      universityName: lab.university_name,
      departmentName: lab.department_name,
      createdAt: lab.created_at,
    };
  }

  // 연구실 초대 코드 생성 요청
  async createInviteCode(
    createUserId: number,
    labId: number,
    dto: CreateInviteCodeRequestDto,
  ): Promise<InviteCodeResponseDto> {
    await this.chkLabExist(labId);
    await this.chkUserPermission(createUserId, labId);

    return this.prisma.$transaction<InviteCodeResponseDto>(async (tx) => {
      // 초대 코드 랜덤 생성
      let code: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        code = randomUUID().slice(0, 8).toUpperCase();
        const chkCodeExist = await tx.invite_codes.findUnique({
          where: { code: code },
        });
        if (!chkCodeExist) {
          break;
        }
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new CommonException(LAB_ERRORS.FAILED_TO_CREATE_INVITE_CODE);
      }

      // 기존 활성화 되어있었던 코드 삭제
      await tx.invite_codes.updateMany({
        where: {
          lab_id: BigInt(labId),
          is_active: true,
        },
        data: { is_active: false },
      });

      // 초대 코드 신규 생성
      const expiresAt = dto.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000); // DEFAULT: 24시간

      const inviteCode = await tx.invite_codes.create({
        data: {
          lab_id: BigInt(labId),
          code: code,
          expires_at: expiresAt,
          is_active: true,
          created_by: BigInt(createUserId),
        },
      });

      return this.toInviteCodeResponse(inviteCode);
    });
  }

  // 초대 코드 비활성화 요청
  async revokeInviteCode(
    labId: number,
    code: string,
    userId: number,
  ): Promise<{ message: string }> {
    await this.chkLabExist(labId);
    await this.chkUserPermission(userId, labId);

    const result = await this.prisma.invite_codes.updateMany({
      where: {
        lab_id: BigInt(labId),
        code: code,
      },
      data: { is_active: false },
    });

    if (result.count === 0) {
      throw new CommonException(LAB_ERRORS.CODE_NOT_FOUND);
    }

    return { message: '초대 코드 삭제가 완료되었습니다' };
  }

  // 초대 코드 검증 요청
  async validateInviteCode(code: string): Promise<ValidateInviteCodeResponseDto> {
    const inviteCode = await this.prisma.invite_codes.findUnique({
      where: { code: code },
      include: {
        labs: {
          include: {
            users: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!inviteCode) {
      throw new CommonException(LAB_ERRORS.CODE_NOT_FOUND);
    }

    // 초대 코드 상태 검증
    this.chkInviteCodeStatus(inviteCode);

    return {
      isValid: true,
      labName: inviteCode.labs.name,
      universityName: inviteCode.labs.university_name,
      departmentName: inviteCode.labs.department_name,
      professorName: inviteCode.labs.users.name,
    };
  }

  // 초대 코드로 연구실 참여 요청
  async joinLab(userId: number, dto: JoinLabRequestDto): Promise<JoinLabResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      // 유저가 소속된 연구실 있는지 체크
      await this.chkUserNotExistInLab(userId, tx);

      // 초대 코드 조회
      const inviteCode = await tx.invite_codes.findUnique({
        where: { code: dto.code },
        include: {
          labs: true,
        },
      });

      // 초대 코드가 존재하지 않음
      if (!inviteCode) {
        throw new CommonException(LAB_ERRORS.CODE_NOT_FOUND);
      }

      // 초대 코드 상태 검증
      this.chkInviteCodeStatus(inviteCode);

      // lab_members 추가
      const membership = await tx.lab_members.create({
        data: {
          user_id: BigInt(userId),
          lab_id: inviteCode.lab_id,
        },
      });

      return {
        labId: Number(inviteCode.lab_id),
        labName: inviteCode.labs.name,
        userId: userId,
        role: membership.role,
      };
    });
  }

  /* ##### 내장 함수 ##### */

  // 교수 인증 확인
  private async chkVerifiedProfessor(userId: number): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) {
      throw new CommonException(LAB_ERRORS.USER_NOT_FOUND);
    }

    if (user.is_professor_verified === false) {
      throw new CommonException(LAB_ERRORS.NOT_VERIFIED_PROFESSOR);
    }
  }

  // 유저가 소속된 연구실이 있는지 확인
  private async chkUserNotExistInLab(
    userId: number,
    client: PrismaClient = this.prisma,
  ): Promise<void> {
    const existMemberInLab = await client.lab_members.findFirst({
      where: { user_id: BigInt(userId), left_at: null },
    });

    if (existMemberInLab) {
      throw new CommonException(LAB_ERRORS.ALREADY_IN_LAB);
    }
  }

  // 유저 권한 체크
  private async chkUserPermission(userId: number, labId: number): Promise<void> {
    const chkMember = await this.prisma.lab_members.findFirst({
      where: { lab_id: BigInt(labId), user_id: BigInt(userId), left_at: null },
    });

    // 연구실에 소속되지 않은 유저
    if (!chkMember) {
      throw new CommonException(LAB_ERRORS.USER_NOT_FOUND_IN_LAB);
    }

    if (chkMember.role !== 'PROFESSOR' && chkMember.role !== 'LAB_LEADER') {
      throw new CommonException(LAB_ERRORS.PERMISSION_DENIED);
    }
  }

  // 연구실 존재 확인
  private async chkLabExist(labId: number): Promise<void> {
    const lab = await this.prisma.labs.findUnique({
      where: { id: BigInt(labId) },
    });

    if (!lab) {
      throw new CommonException(LAB_ERRORS.LAB_NOT_FOUND);
    }
  }

  // 초대 코드 상태 검증
  private chkInviteCodeStatus(inviteCode: { is_active: boolean; expires_at: Date | null }) {
    if (!inviteCode.is_active) {
      throw new CommonException(LAB_ERRORS.CODE_DEACTIVATED);
    }
    if (inviteCode.expires_at && inviteCode.expires_at < new Date()) {
      throw new CommonException(LAB_ERRORS.CODE_EXPIRED);
    }
  }

  // 초대 코드 DTO 형식 변환
  private toInviteCodeResponse(inviteCode: invite_codes): InviteCodeResponseDto {
    return {
      id: Number(inviteCode.id),
      labId: Number(inviteCode.lab_id),
      code: inviteCode.code,
      expiresAt: inviteCode.expires_at,
      isActive: inviteCode.is_active,
      createdAt: inviteCode.created_at,
      createdBy: Number(inviteCode.created_by),
    };
  }
}
