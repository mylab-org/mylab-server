import { ApiProperty } from '@nestjs/swagger';

export class JoinLabResponseDto {
  @ApiProperty({ example: 1, description: '연구실 ID' })
  labId: number;

  @ApiProperty({ example: 'My Lab', description: '연구실 이름' })
  labName: string;

  @ApiProperty({ example: 'MEMBER', description: '연구실 내 역할 (PROFESSOR, LAB_LEADER, MEMBER)' })
  role: string;
}
