import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { USER_ERROR } from '../../constants/user.error.js';

export class ChangePhoneRequestDto {
  @ApiProperty({ example: '01099998888', description: '새 전화번호 (010으로 시작, 11자리)' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PHONE_REQUIRED.message })
  @Matches(/^010[0-9]{8}$/, { message: USER_ERROR.PHONE_INVALID.message })
  phone: string;
}
