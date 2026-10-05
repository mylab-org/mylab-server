import { ApiProperty } from '@nestjs/swagger';
import { Degree } from '@prisma/client';

export class LoginUserDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'student@test.ac.kr' })
  email: string;

  @ApiProperty({ example: '김철수' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;
}

export class LoginResponseDto {
  @ApiProperty({ type: LoginUserDto })
  user: LoginUserDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;
}
