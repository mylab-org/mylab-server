import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEquipmentPurchaseRequestDto {
  @ApiProperty({ example: '로지텍 마우스', description: '비품 이름' })
  @IsString()
  @MinLength(1, { message: '비품 이름을 입력해주세요.' })
  @MaxLength(50, { message: '비품 이름은 50자 이하여야 합니다.' })
  name: string;

  @ApiProperty({ example: 30000, description: '가격 (원)' })
  @IsInt({ message: '가격은 숫자로 입력해주세요.' })
  @Min(0)
  @Max(100_000_000)
  price: number;

  @ApiProperty({ example: 1, description: '개수' })
  @IsInt({ message: '개수는 숫자로 입력해주세요.' })
  @Min(1, { message: '개수는 1개 이상이어야 합니다.' })
  @Max(1000)
  quantity: number;

  @ApiPropertyOptional({
    example: 'https://www.coupang.com/vp/products/123',
    description: '구매 링크',
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { message: '올바른 링크 주소를 입력해주세요. (http:// 또는 https:// 포함)' },
  )
  @MaxLength(2048)
  purchaseLink?: string;
}
