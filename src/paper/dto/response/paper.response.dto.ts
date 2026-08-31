import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Degree } from '@prisma/client';
import { PAPER_STATUS } from '../../constants/paper-status.constant.js';

export class PaperLeadAuthorDto {
  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: '김철수' })
  name: string;
}

export class PaperMemberDto {
  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: '김철수' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;

  @ApiPropertyOptional({ example: 'CO_AUTHOR', nullable: true })
  role: string | null;

  @ApiProperty({ example: false })
  isLeadAuthor: boolean;
}

// 논문과 연결된 일정(학회) 정보 — 카드 UI의 학회명/기간/장소/마감일에 사용
export class PaperScheduleDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '2025 한국통신학회 동계종합학술발표회' })
  title: string;

  @ApiProperty({ example: '2026-02-04T00:00:00.000Z' })
  startAt: Date;

  @ApiPropertyOptional({ example: '2026-02-06T00:00:00.000Z', nullable: true })
  endAt: Date | null;

  @ApiPropertyOptional({ example: '모나 용평(용평리조트)', nullable: true })
  location: string | null;

  @ApiPropertyOptional({ example: '2026-01-28T00:00:00.000Z', nullable: true })
  submissionDeadline: Date | null;

  @ApiPropertyOptional({
    example: 24,
    nullable: true,
    description: '마감까지 남은 일수 (D-24의 24). 마감일이 없으면 null, 지났으면 음수',
  })
  dDay: number | null;
}

export class PaperResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  labId: number;

  @ApiProperty({ example: '논문 제목(가제)' })
  title: string;

  @ApiProperty({ example: 'DRAFTING', enum: PAPER_STATUS })
  status: string;

  @ApiProperty({ example: '초안 작성', description: '상태의 한글 라벨' })
  statusLabel: string;

  @ApiProperty({ example: 3, description: '진행 단계 순번 (1부터 시작, 총 5단계)' })
  statusStep: number;

  @ApiProperty({ example: 5, description: '전체 진행 단계 수' })
  totalSteps: number;

  @ApiPropertyOptional({ type: PaperLeadAuthorDto, nullable: true })
  leadAuthor: PaperLeadAuthorDto | null;

  @ApiProperty({ type: [PaperMemberDto] })
  members: PaperMemberDto[];

  @ApiPropertyOptional({ type: PaperScheduleDto, nullable: true })
  schedule: PaperScheduleDto | null;

  @ApiProperty({ example: '2026-04-25T00:00:00Z' })
  createdAt: Date;
}
