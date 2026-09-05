import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePaperRequestDto {
  @ApiProperty({ example: '논문 제목(가제)', description: '논문 제목' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 1,
    description: '이 논문과 연결할 일정(schedule) ID. 제출할 학회가 정해지지 않았다면 생략 가능',
  })
  @IsOptional()
  @IsInt()
  scheduleId?: number;

  @ApiPropertyOptional({ example: 3, description: '주저자 유저 ID (미지정 시 작성자 본인)' })
  @IsOptional()
  @IsInt()
  leadAuthorUserId?: number;

  @ApiPropertyOptional({
    example: [4, 5],
    description: '공동저자로 참여할 유저 ID 목록',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  participantUserIds?: number[];
}
