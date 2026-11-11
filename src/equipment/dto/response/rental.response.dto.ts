import { ApiProperty } from '@nestjs/swagger';

export class RentalResponseDto {
  @ApiProperty({ example: 1, description: '대여 ID' })
  rentalId: number;

  @ApiProperty({ example: 1, description: '비품 ID' })
  equipmentId: number;

  @ApiProperty({ example: '공용 모니터', description: '비품 이름' })
  equipmentName: string;

  @ApiProperty({ example: 3, description: '대여자 ID' })
  userId: number;

  @ApiProperty({ example: '김철수', description: '대여자 이름' })
  userName: string;

  @ApiProperty({ example: '2026-11-10T04:00:00.000Z', description: '대여 일시' })
  startAt: Date;

  @ApiProperty({ example: '2026-11-10T09:00:00.000Z', description: '반납 일시' })
  endAt: Date;
}
