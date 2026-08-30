import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CancelOccurrenceRequestDto {
  @ApiProperty({
    example: '2026-01-05T10:00:00.000Z',
    description: '취소(스킵)할 반복 일정의 원래 시작 일시',
  })
  @IsDateString()
  occurrence_at: string;
}
