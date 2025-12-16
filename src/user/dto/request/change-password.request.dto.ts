import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { USER_ERROR } from '../../constants/user.error.js';

export class ChangePasswordRequestDto {
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PASSWORD_REQUIRED.message })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PASSWORD_REQUIRED.message })
  @MinLength(8, { message: USER_ERROR.PASSWORD_TOO_SHORT.message })
  newPassword: string;
}
