import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class RentalRequestDto {
  @ApiProperty({ example: '2026-11-10T13:00:00.000+09:00', description: '대여 일시' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2026-11-10T18:00:00.000+09:00', description: '반납 일시' })
  @IsDateString()
  endAt: string;
}
