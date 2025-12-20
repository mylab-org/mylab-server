import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'password123', description: '현재 비밀번호' })
  @IsString()
  @IsNotEmpty({ message: '현재 비밀번호를 입력하세요' })
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123', description: '새 비밀번호 (8자 이상)' })
  @IsString()
  @IsNotEmpty({ message: '새 비밀번호를 입력하세요' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  newPassword: string;
}
