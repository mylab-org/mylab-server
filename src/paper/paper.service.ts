import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { PAPER_ERROR } from './constants/paper.error.js';
import { CreatePaperRequestDto } from './dto/request/create-paper.request.dto.js';
import { UpdatePaperStatusRequestDto } from './dto/request/update-paper-status.request.dto.js';
import { AddPaperMemberRequestDto } from './dto/request/add-paper-member.request.dto.js';
import { PaperResponseDto } from './dto/response/paper.response.dto.js';

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

    await this.prisma.paper_members.create({
      data: {
        paper_id: BigInt(paperId),
        lab_id: BigInt(labId),
        lab_member_id: targetMemberId,
        role: dto.role ?? 'CO_AUTHOR',
      },
    });

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

  // 요청자가 연구실의 활성 멤버인지 확인
  private async chkLabMember(userId: number, labId: number) {
    const member = await this.prisma.lab_members.findFirst({
      where: { user_id: BigInt(userId), lab_id: BigInt(labId), left_at: null },
    });
    if (!member) throw new ForbiddenException(PAPER_ERROR.USER_NOT_FOUND_IN_LAB);
    return member;
  }

  // 논문과 연결할 일정이 해당 연구실에 존재하는지 확인
  private async chkScheduleInLab(scheduleId: number, labId: number) {
    const schedule = await this.prisma.schedules.findFirst({
      where: { id: BigInt(scheduleId), lab_id: BigInt(labId) },
    });
    if (!schedule) throw new NotFoundException(PAPER_ERROR.SCHEDULE_NOT_FOUND);
    return schedule;
  }

  // 유저 ID 목록을 해당 연구실의 lab_member ID로 변환 (없으면 예외)
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

  // 논문 조회 (관계 포함), 존재하지 않으면 예외
  private async chkPaperExists(paperId: number, labId: number): Promise<PaperWithRelations> {
    const paper = await this.prisma.papers.findUnique({
      where: { id_lab_id: { id: BigInt(paperId), lab_id: BigInt(labId) } },
      include: paperInclude,
    });
    if (!paper) throw new NotFoundException(PAPER_ERROR.PAPER_NOT_FOUND);
    return paper;
  }

  // 논문 상태 변경/삭제/멤버 관리 권한 확인 (주저자 또는 교수/랩장만 가능)
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

  // Prisma 응답 형태를 API 응답 DTO 형태로 변환
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

    return {
      id: Number(paper.id),
      labId: Number(paper.lab_id),
      scheduleId: Number(paper.schedule_id),
      title: paper.title,
      status: paper.status,
      leadAuthor,
      members,
      createdAt: paper.created_at,
    };
  }
}
