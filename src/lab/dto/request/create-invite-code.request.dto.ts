import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class CreateInviteCodeRequestDto {
  @ApiPropertyOptional({
    example: '2025-12-25T00:00:00.000Z',
    description: '초대 코드 만료 일시 (미입력시 24시간 후)',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}
