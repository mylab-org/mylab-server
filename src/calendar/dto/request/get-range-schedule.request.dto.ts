import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GetRangeScheduleRequestDto {
  @ApiProperty({ example: '2026-11-08T00:00:00.000+09:00', description: '조회 시작 일시 (포함)' })
  @IsDateString()
  from: string;

  @ApiProperty({ example: '2026-11-15T00:00:00.000+09:00', description: '조회 종료 일시 (미포함)' })
  @IsDateString()
  to: string;
}
