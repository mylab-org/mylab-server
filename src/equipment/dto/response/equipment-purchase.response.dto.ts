import { ApiProperty } from '@nestjs/swagger';
import { EquipmentRequestStatus } from '@prisma/client';

export class EquipmentPurchaseResponseDto {
  @ApiProperty({ example: 1, description: '신청 ID' })
  requestId: number;

  @ApiProperty({ example: '로지텍 마우스', description: '비품 이름' })
  name: string;

  @ApiProperty({ example: 30000, description: '가격 (원)' })
  price: number;

  @ApiProperty({ example: 1, description: '개수' })
  quantity: number;

  @ApiProperty({
    example: 'https://www.coupang.com/vp/products/123',
    nullable: true,
    type: String,
    description: '구매 링크',
  })
  purchaseLink: string | null;

  @ApiProperty({ example: 'PENDING', enum: EquipmentRequestStatus, description: '상태' })
  status: EquipmentRequestStatus;

  @ApiProperty({ example: 3, description: '신청자 ID' })
  requesterId: number;

  @ApiProperty({ example: '김철수', description: '신청자 이름' })
  requesterName: string;

  @ApiProperty({ example: null, nullable: true, type: Date, description: '승인/반려 일시' })
  reviewedAt: Date | null;

  @ApiProperty({ example: '2026-11-10T03:00:00.000Z', description: '신청 일시' })
  createdAt: Date;
}
