import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ERROR } from '../../constants/user.error.js';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'password123', description: '현재 비밀번호' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PASSWORD_REQUIRED.message })
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123', description: '새 비밀번호 (8자 이상)' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PASSWORD_REQUIRED.message })
  @MinLength(8, { message: USER_ERROR.PASSWORD_TOO_SHORT.message })
  newPassword: string;
}
