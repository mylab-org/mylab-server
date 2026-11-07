import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType } from '@prisma/client';
import { IsDateString, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskRequestDto {
  @ApiPropertyOptional({
    example: 'WORK',
    enum: ['WORK', 'MEETING'],
    description: 'WORK: 개인 업무, MEETING: 미팅',
  })
  @IsOptional()
  @IsIn(['WORK', 'MEETING'], { message: '유효하지 않은 업무 종류입니다.' })
  type?: TaskType;

  @ApiPropertyOptional({ example: '주간 미팅', description: '제목' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '제목은 비워둘 수 없습니다.' })
  title?: string;

  @ApiPropertyOptional({ example: '진행 상황 공유', description: '설명' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-10-27T01:00:00.000Z', description: '시작일' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({ example: '2026-10-27T02:00:00.000Z', description: '종료일' })
  @IsOptional()
  @IsDateString()
  endAt?: string;
}
