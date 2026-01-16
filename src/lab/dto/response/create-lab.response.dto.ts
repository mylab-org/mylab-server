import { ApiProperty } from '@nestjs/swagger';

export class CreateLabResponseDto {
  @ApiProperty({ example: 1, description: '연구실 ID' })
  labId: number;

  @ApiProperty({ example: 'My Lab', description: '연구실 이름' })
  labName: string;

  @ApiProperty({ example: 'My university', description: '연구실 소속 학교' })
  universityName: string;

  @ApiProperty({ example: 'My Department', description: '연구실 소속 학과' })
  departmentName: string;

  @ApiProperty({ example: '2025-12-21T00:00:00.000Z', description: '연구실 생성 일시' })
  createdAt: Date;
}
