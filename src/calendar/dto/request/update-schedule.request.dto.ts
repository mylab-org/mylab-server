import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleType, RecurrenceType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateScheduleRequestDto {
  @ApiPropertyOptional({ example: 'MEETING', enum: ScheduleType, description: '일정 타입' })
  @IsOptional()
  @IsEnum(ScheduleType)
  schedule_type?: ScheduleType;

  @ApiPropertyOptional({ example: '주간 랩미팅', description: '일정 이름 (학회명/미팅명/회식명)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '2026-01-05T10:00:00.000Z',
    description: '시작 일시',
  })
  @IsOptional()
  @IsDateString()
  start_at?: string;

  @ApiPropertyOptional({
    example: '2026-01-05T11:00:00.000Z',
    description: '종료 일시',
  })
  @IsOptional()
  @IsDateString()
  end_at?: string;

  @ApiPropertyOptional({ example: '세미나실', description: '장소' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: [1, 3, 5],
    type: [Number],
    description:
      '참가 인원 (lab_member ID 목록). 필드를 보내지 않으면 기존 참가자 유지, 보내면 전체 교체',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  participant_ids?: number[];

  @ApiPropertyOptional({
    example: 'WEEKLY',
    enum: RecurrenceType,
    description: '반복 주기 (MEETING 타입에서만 사용)',
  })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence_type?: RecurrenceType;
}
