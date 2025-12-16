import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { USER_ERROR } from '../../constants/user.error.js';

export class ChangePhoneRequestDto {
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PHONE_REQUIRED.message })
  @Matches(/^010[0-9]{8}$/, { message: USER_ERROR.PHONE_INVALID.message })
  phone: string;
}
