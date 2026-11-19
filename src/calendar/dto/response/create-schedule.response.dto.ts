import { ApiProperty } from '@nestjs/swagger';
import { RecurrenceType, ScheduleType } from '@prisma/client';

export class CreateScheduleResponseDto {
  @ApiProperty({ example: 1, description: '일정 ID' })
  id: number;

  @ApiProperty({ example: 'MEETING', enum: ScheduleType, description: '일정 타입' })
  scheduleType: ScheduleType;

  @ApiProperty({ example: '주간 랩미팅', description: '일정 이름' })
  title: string;

  @ApiProperty({ example: '2026-01-05T10:00:00.000Z', description: '시작 일시' })
  startAt: Date;

  @ApiProperty({ example: '2026-01-05T11:00:00.000Z', nullable: true, description: '종료 일시' })
  endAt: Date | null;

  @ApiProperty({ example: '세미나실', nullable: true, description: '장소' })
  location: string | null;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    description: '참가 인원 (유저 ID 목록)',
  })
  participantIds: number[];

  @ApiProperty({ example: 'NONE', enum: RecurrenceType, description: '반복 주기' })
  recurrenceType: RecurrenceType;
}
