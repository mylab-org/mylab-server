import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  ValidateIf,
} from 'class-validator';

export class CreateScheduleRequestDto {
  @ApiProperty({ example: 'MEETING', enum: ScheduleType, description: '일정 타입' })
  @IsEnum(ScheduleType)
  schedule_type: ScheduleType;

  @ApiProperty({ example: '주간 랩미팅', description: '일정 이름 (학회명/미팅명/회식명)' })
  @IsString()
  title: string;

  @ApiProperty({
    example: '2026-01-05T10:00:00.000Z',
    description: '시작 일시 (학회는 시작일, 미팅/회식은 날짜+시간)',
  })
  @IsDateString()
  start_at: string;

  @ApiPropertyOptional({
    example: '2026-01-05T11:00:00.000Z',
    description: '종료 일시 (학회/미팅은 필수, 회식은 사용하지 않음)',
  })
  @ValidateIf((o: CreateScheduleRequestDto) => o.schedule_type !== ScheduleType.LAB_DINNER)
  @IsDateString()
  end_at?: string;

  @ApiProperty({ example: '세미나실', description: '장소' })
  @IsString()
  location: string;

  @ApiProperty({
    example: [1, 3, 5],
    type: [Number],
    description: '참가 인원 (lab_member ID 목록)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  participant_ids: number[];

  @ApiPropertyOptional({
    example: 'WEEKLY',
    enum: RecurrenceType,
    description: '반복 주기 (MEETING 타입에서만 사용, 미입력 시 1회성 일정)',
  })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence_type?: RecurrenceType;

  @ApiPropertyOptional({
    example: '2026-01-28T23:59:00.000Z',
    description: '논문 제출 마감 일시 (CONFERENCE 타입에서 사용, 논문 카드의 D-day 계산에 쓰임)',
  })
  @IsOptional()
  @IsDateString()
  submission_deadline?: string;
}
