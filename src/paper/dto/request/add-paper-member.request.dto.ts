import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AddPaperMemberRequestDto {
  @ApiProperty({ example: 6, description: '추가할 유저 ID' })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({ example: 'CO_AUTHOR', description: '논문 내 역할' })
  @IsOptional()
  @IsString()
  role?: string;
}
