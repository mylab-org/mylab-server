import { ApiProperty } from '@nestjs/swagger';

export class InviteCodeResponseDto {
  @ApiProperty({ example: 1, description: '초대 코드 ID' })
  id: number;

  @ApiProperty({ example: 1, description: '코드에 해당하는 연구실 ID' })
  labId: number;

  @ApiProperty({ example: '0A2B3C4D', description: '8자리 연구실 초대 코드' })
  code: string;

  @ApiProperty({ example: '2025-12-21T00:00:00.000Z', description: '초대 코드 만료 일시' })
  expiresAt: Date;

  @ApiProperty({ examples: [true, false], description: '초대 코드 유효 여부 DEFAULT: true' })
  isActive: boolean;

  @ApiProperty({ example: '2025-12-21T00:00:00.000Z', description: '초대 코드 생성 일시' })
  createdAt: Date;

  @ApiProperty({ example: 1, description: '초대 코드 생성자 ID' })
  createdBy: number;
}
