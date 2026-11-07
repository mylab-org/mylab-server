import { ApiProperty } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';
import { IsDateString, IsIn, IsString, MinLength } from 'class-validator';

export class CreateTaskRequestDto {
  @ApiProperty({
    example: 'WORK',
    enum: ['WORK', 'MEETING'],
    description: 'WORK: 개인 업무, MEETING: 미팅',
  })
  @IsIn(['WORK', 'MEETING'], { message: '유효하지 않은 업무 종류입니다.' })
  type: TaskType;

  @ApiProperty({ example: '주간 미팅', description: '제목' })
  @IsString()
  @MinLength(1, { message: '제목은 비워둘 수 없습니다.' })
  title: string;

  @ApiProperty({ example: '진행 상황 공유', description: '설명' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-10-27T01:00:00.000Z', description: '시작일' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2026-10-27T02:00:00.000Z', description: '종료일' })
  @IsDateString()
  endAt: string;
}
