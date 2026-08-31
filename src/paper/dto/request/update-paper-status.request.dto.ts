import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { PAPER_STATUS } from '../../constants/paper-status.constant.js';
import type { PaperStatus } from '../../constants/paper-status.constant.js';

export class UpdatePaperStatusRequestDto {
  @ApiProperty({ example: 'WRITING', enum: PAPER_STATUS })
  @IsIn(PAPER_STATUS, { message: '유효하지 않은 논문 상태입니다.' })
  status: PaperStatus;
}
