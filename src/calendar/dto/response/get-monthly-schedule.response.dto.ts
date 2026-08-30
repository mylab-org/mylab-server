import { ApiProperty } from '@nestjs/swagger';
import { RecurrenceType, ScheduleType } from '@prisma/client';

export class GetMonthlyScheduleResponseDto {
  @ApiProperty({ example: 1, description: '일정 ID' })
  id: number;

  @ApiProperty({ example: '주간 랩미팅', description: '일정 이름' })
  title: string;

  @ApiProperty({
    example: 'MEETING',
    enum: ['CONFERENCE', 'MEETING', 'LAB_DINNER'],
    description: '일정 타입',
  })
  schedule_type: ScheduleType;

  @ApiProperty({ example: '2026-01-05T10:00:00.000Z', description: '시작 일시' })
  start_at: Date;

  @ApiProperty({ example: '2026-01-05T11:00:00.000Z', nullable: true, description: '종료 일시' })
  end_at: Date | null;

  @ApiProperty({ example: '세미나실', nullable: true, description: '장소' })
  location: string | null;

  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
    description: '참가 인원 (lab_member ID 목록)',
  })
  participant_ids: number[];

  @ApiProperty({ example: 'NONE', enum: RecurrenceType, description: '반복 주기' })
  recurrence_type: RecurrenceType;

  @ApiProperty({ example: false, description: '해당 반복 일정이 취소(스킵)되었는지 여부' })
  is_cancelled: boolean;
}
