import { ApiProperty } from '@nestjs/swagger';

export class GetLabResponseDto {
  @ApiProperty({ example: 1, description: '연구실 ID' })
  labId: number;

  @ApiProperty({ example: '마이랩 연구실', description: '연구실 이름' })
  labName: string;

  @ApiProperty({ example: 'My University', description: '연구실 소속 학교' })
  universityName: string;

  @ApiProperty({ example: 'My Department', description: '연구실 소속 학과' })
  departmentName: string;

  @ApiProperty({ example: '김교수', description: '교수 이름' })
  professorName: string;

  @ApiProperty({
    example: '본 연구실은 광대역 지능형 통신 네트워크를 연구합니다.',
    description: '연구실 소개. 없으면 null',
    nullable: true,
    type: String,
  })
  description: string | null;

  @ApiProperty({
    example: ['무선 네트워크', '스마트 IoT'],
    description: '연구 분야. 없으면 빈 배열',
    type: [String],
  })
  researchFields: string[];
}
