import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { USER_ERROR } from '../../constants/user.error.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'newuser1', description: '아이디' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.USERNAME_REQUIRED.message })
  username: string;

  @ApiProperty({ example: '01055556666', description: '전화번호 (010으로 시작, 11자리)' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PHONE_REQUIRED.message })
  @Matches(/^010[0-9]{8}$/, { message: USER_ERROR.PHONE_INVALID.message })
  phone: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 (8자 이상)' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.PASSWORD_REQUIRED.message })
  @MinLength(8, { message: USER_ERROR.PASSWORD_TOO_SHORT.message })
  password: string;

  @ApiProperty({ example: '이교수', description: '이름' })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.NAME_REQUIRED.message })
  name: string;

  @ApiProperty({
    example: 'MASTER',
    enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'],
    description: '학위',
  })
  @IsString()
  @IsNotEmpty({ message: USER_ERROR.DEGREE_REQUIRED.message })
  @IsEnum(['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'])
  degree: string;

  @ApiProperty({
    example: 'newprof@univ.ac.kr',
    required: false,
    description: '교수 이메일 (교수만 필수)',
  })
  @ValidateIf((o: CreateUserRequestDto) => o.degree === 'PROFESSOR')
  @IsNotEmpty({ message: USER_ERROR.EMAIL_REQUIRED.message })
  @IsEmail({}, { message: USER_ERROR.EMAIL_INVALID.message })
  professorEmail?: string;
}
