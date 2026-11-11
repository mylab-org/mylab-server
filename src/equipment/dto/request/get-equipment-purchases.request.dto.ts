import { ApiPropertyOptional } from '@nestjs/swagger';
import { EquipmentRequestStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetEquipmentPurchasesRequestDto {
  @ApiPropertyOptional({ enum: EquipmentRequestStatus, description: '상태 필터. 없으면 전체' })
  @IsOptional()
  @IsEnum(EquipmentRequestStatus)
  status?: EquipmentRequestStatus;
}
