import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateEquipmentRequestDto {
  @ApiPropertyOptional({ example: '공용 모니터', description: '비품 이름' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '비품 이름을 입력해주세요.' })
  @MaxLength(50, { message: '비품 이름은 50자 이하여야 합니다.' })
  name?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.mylab.ac.kr/monitor.png',
    description: '비품 사진 URL',
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { message: '올바른 이미지 주소를 입력해주세요.' },
  )
  imageUrl?: string;

  @ApiPropertyOptional({ example: false, description: '대여 활성화 여부' })
  @IsOptional()
  @IsBoolean()
  isRentable?: boolean;
}
