import { ApiProperty } from '@nestjs/swagger';
import { RentalResponseDto } from './rental.response.dto.js';

export class EquipmentResponseDto {
  @ApiProperty({ example: 1, description: '비품 ID' })
  equipmentId: number;

  @ApiProperty({ example: '공용 모니터', description: '비품 이름' })
  name: string;

  @ApiProperty({
    example: 'https://cdn.mylab.ac.kr/monitor.png',
    nullable: true,
    type: String,
    description: '비품 사진 URL',
  })
  imageUrl: string | null;

  @ApiProperty({ example: true, description: '대여 활성화 여부' })
  isRentable: boolean;

  @ApiProperty({
    type: [RentalResponseDto],
    description: '진행 중이거나 예정된 대여 (대여 일시순)',
  })
  rentals: RentalResponseDto[];
}
