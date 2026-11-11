import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class DeleteEquipmentsRequestDto {
  @ApiProperty({ example: [1, 2], type: [Number], description: '삭제할 비품 ID 목록' })
  @IsArray()
  @ArrayNotEmpty({ message: '삭제할 비품을 선택해주세요.' })
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  equipmentIds: number[];
}
