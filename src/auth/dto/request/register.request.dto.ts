import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Degree } from '@prisma/client';
import { IsUniversityEmail } from '../../../common/decoraters/is-university-email.decorater.js';
import { Match } from '../../../common/decoraters/match.decorator.js';

export class RegisterRequestDto {
  @ApiProperty({ example: '김철수', description: '이름' })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력하세요' })
  @MaxLength(40, { message: '이름은 최대 40자까지 입력할 수 있습니다' })
  name: string;

  @ApiProperty({
    example: 'noreply.mylab@gmail.com',
    description: '이메일 (교수의 경우 .edu 또는 .ac.kr 필수)',
  })
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력하세요' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다' })
  @ValidateIf((o) => (o as RegisterRequestDto).degree === Degree.PROFESSOR)
  @IsUniversityEmail()
  email: string;

  @ApiProperty({
    description: '학위',
    enum: Degree,
    example: Degree.BACHELOR,
  })
  @IsNotEmpty({ message: '학위를 입력하세요' })
  @IsEnum(Degree, { message: '유효하지 않은 학위입니다' })
  degree: Degree;

  @ApiProperty({ example: 'password123!', description: '비밀번호' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력하세요' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*~])[a-zA-Z0-9!@#$%^&*~]{6,30}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자를 포함한 6~30자여야 합니다',
  })
  password: string;

  @ApiProperty({ example: 'password123!', description: '비밀번호 확인' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력하세요' })
  @Match('password', { message: '비밀번호가 일치하지 않습니다' })
  passwordConfirm: string;
}
