import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: bigint;

  @ApiProperty({ example: 'john123' })
  username: string;

  @ApiProperty({ example: '01012345678' })
  phone: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: 'MASTER', enum: ['BACHELOR', 'MASTER', 'DOCTOR', 'PROFESSOR'] })
  degree: string;

  @ApiProperty({ example: 'prof@univ.ac.kr', nullable: true })
  professor_email: string | null;

  @ApiProperty({ example: 'NONE', enum: ['NONE', 'PENDING', 'VERIFIED'] })
  professor_status: string;

  @ApiProperty({ example: '2024-12-16T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-12-16T00:00:00.000Z' })
  updated_at: Date;
}
