import { ApiProperty } from '@nestjs/swagger';

export class LabLinkResponseDto {
  @ApiProperty({ example: 1, description: '링크 ID' })
  linkId: number;

  @ApiProperty({ example: '연구실 홈페이지', description: '링크 이름' })
  name: string;

  @ApiProperty({ example: 'https://example.com', description: '링크 URL' })
  url: string;
}
