import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLabResponseDto {
  @ApiProperty({ example: 1, description: '연구실 ID' })
  labId: number;

  @ApiProperty({ example: 'My Lab', description: '연구실 이름' })
  labName: string;

  @ApiPropertyOptional({
    example: '딥러닝 기반 의료 영상 연구실입니다.',
    description: '연구실 소개',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: ['딥러닝', '의료영상'], description: '해시태그', type: [String] })
  hashtags: string[];

  @ApiProperty({ example: 'My university', description: '연구실 소속 학교' })
  universityName: string;

  @ApiProperty({ example: 'My Department', description: '연구실 소속 학과' })
  departmentName: string;
}
