import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { TASK_STATUS } from '../../constants/tast-status.constant.js';
import type { TaskStatus } from '../../constants/tast-status.constant.js';

export class UpdateTaskStatusRequestDto {
  @ApiProperty({ example: 'IN_PROGRESS', enum: TASK_STATUS })
  @IsIn(TASK_STATUS, { message: '유효하지 않은 업무 상태입니다.' })
  status: TaskStatus;
}
