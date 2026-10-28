import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUS } from '../../constants/tast-status.constant.js';

export class TaskResponseDto {
  @ApiProperty({ example: 1, description: '업무 ID' })
  taskId: number;

  @ApiProperty({ example: 1, description: '작성자 ID' })
  userId: number;

  @ApiProperty({ example: 'WORK', enum: ['WORK', 'MEETING'] })
  type: string;

  @ApiProperty({ example: '주간 미팅' })
  title: string;

  @ApiProperty({ example: '진행 상황 공유' })
  description: string;

  @ApiProperty({ example: '2026-10-27T01:00:00.000Z' })
  startAt: Date;

  @ApiProperty({ example: '2026-10-27T02:00:00.000Z' })
  endAt: Date;

  @ApiProperty({ example: 'READY', enum: TASK_STATUS })
  status: string;

  @ApiProperty({ example: '시작 전', description: '상태의 한글 라벨' })
  statusLabel: string;

  @ApiProperty({ example: 1, description: '진행 단계 순번 (1부터 시작, 총 3단계)' })
  statusStep: number;

  @ApiProperty({ example: 3, description: '전체 진행 단계 수' })
  totalSteps: number;

  @ApiProperty({ example: '2026-10-26T00:00:00.000Z' })
  createdAt: Date;
}
