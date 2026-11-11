import { ApiProperty } from '@nestjs/swagger';
import { EquipmentRequestStatus } from '@prisma/client';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsIn, IsInt } from 'class-validator';

export class ReviewEquipmentPurchasesRequestDto {
  @ApiProperty({ example: [1, 2], type: [Number], description: '승인/반려할 신청 ID 목록' })
  @IsArray()
  @ArrayNotEmpty({ message: '신청을 선택해주세요.' })
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  requestIds: number[];

  @ApiProperty({ example: 'APPROVED', enum: ['APPROVED', 'REJECTED'], description: '변경할 상태' })
  @IsIn([EquipmentRequestStatus.APPROVED, EquipmentRequestStatus.REJECTED])
  status: EquipmentRequestStatus;
}
