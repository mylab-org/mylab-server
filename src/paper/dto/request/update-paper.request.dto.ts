import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePaperRequestDto {
  @ApiPropertyOptional({ example: '딥러닝 기반 이상탐지 연구', description: '논문 제목' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '제목은 비워둘 수 없습니다.' })
  title?: string;

  @ApiPropertyOptional({
    example: 4,
    description: '주저자로 지정할 유저 ID. 논문 참여자가 아니면 자동으로 참여자에 추가됩니다.',
  })
  @IsOptional()
  @IsInt()
  leadAuthorUserId?: number;

  @ApiPropertyOptional({ example: 7, description: '연결할 일정(schedule) ID' })
  @IsOptional()
  @IsInt()
  scheduleId?: number;
}
