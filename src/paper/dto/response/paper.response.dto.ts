import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Degree } from '@prisma/client';
import { PAPER_STATUS } from '../../constants/paper-status.constant.js';

export class PaperLeadAuthorDto {
  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: '홍길동' })
  name: string;
}

export class PaperMemberDto {
  @ApiProperty({ example: 3 })
  userId: number;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;

  @ApiPropertyOptional({ example: 'CO_AUTHOR', nullable: true })
  role: string | null;

  @ApiProperty({ example: false })
  isLeadAuthor: boolean;
}

export class PaperResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  labId: number;

  @ApiProperty({ example: 1 })
  scheduleId: number;

  @ApiProperty({ example: '논문 제목(가제)' })
  title: string;

  @ApiProperty({ example: 'WRITING', enum: PAPER_STATUS })
  status: string;

  @ApiPropertyOptional({ type: PaperLeadAuthorDto, nullable: true })
  leadAuthor: PaperLeadAuthorDto | null;

  @ApiProperty({ type: [PaperMemberDto] })
  members: PaperMemberDto[];

  @ApiProperty({ example: '2026-04-25T00:00:00Z' })
  createdAt: Date;
}
