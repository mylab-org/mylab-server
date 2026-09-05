import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { PAPER_ERROR } from './constants/paper.error.js';
import { CreatePaperRequestDto } from './dto/request/create-paper.request.dto.js';
import { UpdatePaperStatusRequestDto } from './dto/request/update-paper-status.request.dto.js';
import { UpdatePaperRequestDto } from './dto/request/update-paper.request.dto.js';
import { UpdatePaperMemberRequestDto } from './dto/request/update-paper-member.request.dto.js';
import { AddPaperMemberRequestDto } from './dto/request/add-paper-member.request.dto.js';
import { PaperResponseDto } from './dto/response/paper.response.dto.js';
import { PAPER_STATUS, PAPER_STATUS_LABEL, DEFAULT_PAPER_STATUS } from './constants/paper-status.constant.js';
import type { PaperStatus } from './constants/paper-status.constant.js';

const paperInclude = {
  lab_members: {
    include: { users: { select: { id: true, name: true } } },
  },
  paper_members: {
    include: {
      lab_members: {
        include: { users: { select: { id: true, name: true, degree: true } } },
      },
    },
  },
  schedules: {
    select: {
      id: true,
      schedule_type: true,
      title: true,
      start_at: true,
      end_at: true,
      location: true,
      submission_deadline: true,
    },
  },
} satisfies Prisma.papersInclude;

type PaperWithRelations = Prisma.papersGetPayload<{ include: typeof paperInclude }>;

@Injectable()
export class PaperService {
  constructor(private prisma: PrismaService) {}

  async createPaper(
    userId: number,
    labId: number,
    dto: CreatePaperRequestDto,
  ): Promise<PaperResponseDto> {
    await this.chkLabMember(userId, labId);
    await this.chkScheduleInLab(dto.scheduleId, labId);

    const leadAuthorUserId = dto.leadAuthorUserId ?? userId;
    const participantUserIds = (dto.participantUserIds ?? []).filter(
      (id) => id !== leadAuthorUserId,
    );

    const memberIdMap = await this.resolveLabMemberIds(
      [leadAuthorUserId, ...participantUserIds],
      labId,
    );
    const leadAuthorMemberId = memberIdMap.get(leadAuthorUserId)!;

    const paperId = await this.prisma.$transaction(async (tx) => {
      const paper = await tx.papers.create({
        data: {
          title: dto.title,
          lab_id: BigInt(labId),
          schedule_id: BigInt(dto.scheduleId),
          lead_author_member_id: leadAuthorMemberId,
          status: DEFAULT_PAPER_STATUS,
        },
      });

      await tx.paper_members.createMany({
        data: [
          {
            paper_id: paper.id,
            lab_id: BigInt(labId),
            lab_member_id: leadAuthorMemberId,
            role: 'LEAD_AUTHOR',
          },
          ...participantUserIds.map((pid) => ({
            paper_id: paper.id,
            lab_id: BigInt(labId),
            lab_member_id: memberIdMap.get(pid)!,
            role: 'CO_AUTHOR',
          })),
        ],
      });

      return paper.id;
    });

    return this.getPaper(userId, labId, Number(paperId));
  }

  async listPapers(userId: number, labId: number): Promise<PaperResponseDto[]> {
    await this.chkLabMember(userId, labId);

    const papers = await this.prisma.papers.findMany({
      where: { lab_id: BigInt(labId) },
      include: paperInclude,
      orderBy: { created_at: 'desc' },
    });

    return papers.map((paper) => this.toPaperResponse(paper));
  }

  async getPaper(userId: number, labId: number, paperId: number): Promise<PaperResponseDto> {
    await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    return this.toPaperResponse(paper);
  }

  async updatePaper(
    userId: number,
    labId: number,
    paperId: number,
    dto: UpdatePaperRequestDto,
  ): Promise<PaperResponseDto> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    if (dto.scheduleId !== undefined) {
      await this.chkScheduleInLab(dto.scheduleId, labId);
    }

    let newLeadAuthorMemberId: bigint | undefined;
    if (dto.leadAuthorUserId !== undefined) {
      const memberIdMap = await this.resolveLabMemberIds([dto.leadAuthorUserId], labId);
      newLeadAuthorMemberId = memberIdMap.get(dto.leadAuthorUserId)!;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.papers.update({
        where: { id_lab_id: { id: BigInt(paperId), lab_id: BigInt(labId) } },
        data: {
          title: dto.title,
          schedule_id: dto.scheduleId !== undefined ? BigInt(dto.scheduleId) : undefined,
          lead_author_member_id: newLeadAuthorMemberId,
        },
      });

      if (newLeadAuthorMemberId === undefined) return;

      if (paper.lead_author_member_id && paper.lead_author_member_id !== newLeadAuthorMemberId) {
        await tx.paper_members.updateMany({
          where: { paper_id: BigInt(paperId), lab_member_id: paper.lead_author_member_id },
          data: { role: 'CO_AUTHOR' },
        });
      }

      const isAlreadyMember = paper.paper_members.some(
        (pm) => pm.lab_member_id === newLeadAuthorMemberId,
      );

      if (isAlreadyMember) {
        await tx.paper_members.updateMany({
          where: { paper_id: BigInt(paperId), lab_member_id: newLeadAuthorMemberId },
          data: { role: 'LEAD_AUTHOR' },
        });
      } else {
        await tx.paper_members.create({
          data: {
            paper_id: BigInt(paperId),
            lab_id: BigInt(labId),
            lab_member_id: newLeadAuthorMemberId,
            role: 'LEAD_AUTHOR',
          },
        });
      }
    });

    return this.getPaper(userId, labId, paperId);
  }

  async updateStatus(
    userId: number,
    labId: number,
    paperId: number,
    dto: UpdatePaperStatusRequestDto,
  ): Promise<PaperResponseDto> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    await this.prisma.papers.update({
      where: { id_lab_id: { id: BigInt(paperId), lab_id: BigInt(labId) } },
      data: { status: dto.status },
    });

    return this.getPaper(userId, labId, paperId);
  }

  async deletePaper(userId: number, labId: number, paperId: number): Promise<{ message: string }> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    await this.prisma.papers.delete({
      where: { id_lab_id: { id: BigInt(paperId), lab_id: BigInt(labId) } },
    });

    return { message: '논문이 삭제되었습니다.' };
  }

  async addMember(
    userId: number,
    labId: number,
    paperId: number,
    dto: AddPaperMemberRequestDto,
  ): Promise<PaperResponseDto> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    const memberIdMap = await this.resolveLabMemberIds([dto.userId], labId);
    const targetMemberId = memberIdMap.get(dto.userId)!;

    const alreadyMember = paper.paper_members.some((pm) => pm.lab_member_id === targetMemberId);
    if (alreadyMember) throw new BadRequestException(PAPER_ERROR.ALREADY_PAPER_MEMBER);

    try {
      await this.prisma.paper_members.create({
        data: {
          paper_id: BigInt(paperId),
          lab_id: BigInt(labId),
          lab_member_id: targetMemberId,
          role: dto.role ?? 'CO_AUTHOR',
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException(PAPER_ERROR.ALREADY_PAPER_MEMBER);
      }
      throw e;
    }

    return this.getPaper(userId, labId, paperId);
  }

  async updateMemberRole(
    userId: number,
    labId: number,
    paperId: number,
    memberUserId: number,
    dto: UpdatePaperMemberRequestDto,
  ): Promise<PaperResponseDto> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    const memberIdMap = await this.resolveLabMemberIds([memberUserId], labId);
    const targetMemberId = memberIdMap.get(memberUserId)!;

    if (targetMemberId === paper.lead_author_member_id) {
      throw new BadRequestException(PAPER_ERROR.CANNOT_CHANGE_LEAD_AUTHOR_ROLE);
    }

    const result = await this.prisma.paper_members.updateMany({
      where: { paper_id: BigInt(paperId), lab_member_id: targetMemberId },
      data: { role: dto.role },
    });

    if (result.count === 0) throw new NotFoundException(PAPER_ERROR.PAPER_MEMBER_NOT_FOUND);

    return this.getPaper(userId, labId, paperId);
  }

  async removeMember(
    userId: number,
    labId: number,
    paperId: number,
    memberUserId: number,
  ): Promise<PaperResponseDto> {
    const requester = await this.chkLabMember(userId, labId);
    const paper = await this.chkPaperExists(paperId, labId);
    this.chkManagePermission(requester, paper);

    const memberIdMap = await this.resolveLabMemberIds([memberUserId], labId);
    const targetMemberId = memberIdMap.get(memberUserId)!;

    if (targetMemberId === paper.lead_author_member_id) {
      throw new BadRequestException(PAPER_ERROR.CANNOT_REMOVE_LEAD_AUTHOR);
    }

    const result = await this.prisma.paper_members.deleteMany({
      where: { paper_id: BigInt(paperId), lab_member_id: targetMemberId },
    });

    if (result.count === 0) throw new NotFoundException(PAPER_ERROR.PAPER_MEMBER_NOT_FOUND);

    return this.getPaper(userId, labId, paperId);
  }

  /* ##### 내장 함수 ##### */

  private async chkLabMember(userId: number, labId: number) {
    const member = await this.prisma.lab_members.findFirst({
      where: { user_id: BigInt(userId), lab_id: BigInt(labId), left_at: null },
    });
    if (!member) throw new ForbiddenException(PAPER_ERROR.USER_NOT_FOUND_IN_LAB);
    return member;
  }

  private async chkScheduleInLab(scheduleId: number, labId: number) {
    const schedule = await this.prisma.schedules.findFirst({
      where: { id: BigInt(scheduleId), lab_id: BigInt(labId) },
    });
    if (!schedule) throw new NotFoundException(PAPER_ERROR.SCHEDULE_NOT_FOUND);
    return schedule;
  }

  private async resolveLabMemberIds(
    userIds: number[],
    labId: number,
  ): Promise<Map<number, bigint>> {
    const uniqueUserIds = [...new Set(userIds)];
    if (uniqueUserIds.length === 0) return new Map();

    const members = await this.prisma.lab_members.findMany({
      where: {
        user_id: { in: uniqueUserIds.map((id) => BigInt(id)) },
        lab_id: BigInt(labId),
        left_at: null,
      },
    });

    if (members.length !== uniqueUserIds.length) {
      throw new NotFoundException(PAPER_ERROR.MEMBER_NOT_FOUND_IN_LAB);
    }

    return new Map(members.map((m) => [Number(m.user_id), m.id]));
  }

  private async chkPaperExists(paperId: number, labId: number): Promise<PaperWithRelations> {
    const paper = await this.prisma.papers.findUnique({
      where: { id_lab_id: { id: BigInt(paperId), lab_id: BigInt(labId) } },
      include: paperInclude,
    });
    if (!paper) throw new NotFoundException(PAPER_ERROR.PAPER_NOT_FOUND);
    return paper;
  }

  private chkManagePermission(
    requester: { id: bigint; role: Role },
    paper: { lead_author_member_id: bigint | null },
  ) {
    const isAdmin = requester.role === Role.PROFESSOR || requester.role === Role.LAB_LEADER;
    const isLeadAuthor = paper.lead_author_member_id === requester.id;
    if (!isAdmin && !isLeadAuthor) {
      throw new ForbiddenException(PAPER_ERROR.PERMISSION_DENIED);
    }
  }

  private calculateDDay(deadline: Date | null): number | null {
    if (!deadline) return null;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfDeadline = new Date(deadline);
    startOfDeadline.setHours(0, 0, 0, 0);

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    return Math.round((startOfDeadline.getTime() - startOfToday.getTime()) / MS_PER_DAY);
  }

  private toPaperResponse(paper: PaperWithRelations): PaperResponseDto {
    const leadAuthor = paper.lab_members?.users
      ? { userId: Number(paper.lab_members.users.id), name: paper.lab_members.users.name }
      : null;

    const members = paper.paper_members.map((pm) => ({
      userId: Number(pm.lab_members.users.id),
      name: pm.lab_members.users.name,
      degree: pm.lab_members.users.degree,
      role: pm.role,
      isLeadAuthor: pm.lab_member_id === paper.lead_author_member_id,
    }));

    const schedule = paper.schedules
      ? {
          id: Number(paper.schedules.id),
          scheduleType: paper.schedules.schedule_type,
          title: paper.schedules.title,
          startAt: paper.schedules.start_at,
          endAt: paper.schedules.end_at,
          location: paper.schedules.location,
          submissionDeadline: paper.schedules.submission_deadline,
          dDay: this.calculateDDay(paper.schedules.submission_deadline),
        }
      : null;

    const statusIndex = PAPER_STATUS.indexOf(paper.status as PaperStatus);

    return {
      id: Number(paper.id),
      labId: Number(paper.lab_id),
      title: paper.title,
      status: paper.status,
      statusLabel: PAPER_STATUS_LABEL[paper.status as PaperStatus] ?? paper.status,
      statusStep: statusIndex + 1,
      totalSteps: PAPER_STATUS.length,
      leadAuthor,
      members,
      schedule,
      createdAt: paper.created_at,
    };
  }
}
