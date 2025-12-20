import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'newuser1', description: '아이디', required: false })
  @IsString()
  @ValidateIf((o: LoginRequestDto) => !o.phone)
  @IsNotEmpty({ message: '아이디 또는 전화번호를 입력하세요' })
  username?: string;

  @ApiProperty({ example: '01055556666', description: '전화번호', required: false })
  @IsString()
  @ValidateIf((o: LoginRequestDto) => !o.username)
  @IsNotEmpty({ message: '아이디 또는 전화번호를 입력하세요' })
  phone?: string;

  @ApiProperty({ example: 'password123', description: '비밀번호' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력하세요' })
  password: string;
}
