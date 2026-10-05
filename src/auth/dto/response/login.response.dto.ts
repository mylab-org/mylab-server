import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Degree } from '@prisma/client';
import { LabMembershipDto } from '../../../common/dto/response/lab-membership.response.dto.js';

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

  @ApiPropertyOptional({
    type: LabMembershipDto,
    nullable: true,
    description: '소속 연구실 정보. 소속된 연구실이 없으면 null',
  })
  lab: LabMembershipDto | null;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  refreshToken: string;
}
