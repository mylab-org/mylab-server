import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'user@email.com', description: '이메일' })
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력하세요' })
  email: string;

  @ApiProperty({ example: 'password123!', description: '비밀번호' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력하세요' })
  password: string;
}
