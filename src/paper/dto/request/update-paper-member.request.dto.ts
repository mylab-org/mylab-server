import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePaperMemberRequestDto {
  @ApiProperty({ example: 'CO_AUTHOR', description: '논문 내 역할' })
  @IsString()
  @MinLength(1, { message: '역할은 비워둘 수 없습니다.' })
  role: string;
}
