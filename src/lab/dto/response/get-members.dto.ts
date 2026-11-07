import { ApiProperty } from '@nestjs/swagger';
import { Degree } from '@prisma/client';

export class GetMembersResponseDto {
  @ApiProperty({ example: 1, description: '멤버 사용자 ID' })
  userId: number;

  @ApiProperty({ example: '홍길동', description: '멤버 이름' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: Degree;

  @ApiProperty({ example: 'MEMBER', description: '역할' })
  role: string;
}
