import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUniversityEmail } from '../../../common/decoraters/is-university-email.decorater.js';

export class RegisterRequestDto {
  @ApiProperty({ example: 'newuser1', description: '아이디' })
  @IsString()
  @IsNotEmpty({ message: '아이디를 입력하세요' })
  username: string;

  @ApiProperty({ example: '01055556666', description: '전화번호 (010으로 시작, 11자리)' })
  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력하세요' })
  @Matches(/^010[0-9]{8}$/, { message: '올바른 전화번호 형식이 아닙니다' })
  phone: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 (8자 이상)' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력하세요' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  password: string;

  @ApiProperty({ example: '김철수', description: '이름' })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력하세요' })
  name: string;

  @ApiProperty({
    example: 'MASTER',
    enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'],
    description: '학위',
  })
  @IsString()
  @IsNotEmpty({ message: '학위를 선택하세요' })
  @IsEnum(['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'])
  degree: string;

  @ApiProperty({
    example: 'newprof@korea.ac.kr',
    required: false,
    description: '교수 이메일 (교수만 필수)',
  })
  @ValidateIf((o: RegisterRequestDto) => o.degree === 'PROFESSOR')
  @IsNotEmpty({ message: '교수는 이메일을 입력하세요' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  @IsUniversityEmail()
  professorEmail?: string;
}
