import { ApiProperty } from '@nestjs/swagger';

export class LabLinkResponseDto {
  @ApiProperty({ example: 1, description: '링크 ID' })
  linkId: number;

  @ApiProperty({ example: '연구실 홈페이지', description: '링크 제목' })
  name: string;

  @ApiProperty({ example: 'https://mylab.ac.kr', description: '링크 주소' })
  url: string;

  @ApiProperty({ example: '2026-11-09T00:00:00.000Z', description: '등록 일시' })
  createdAt: Date;
}
