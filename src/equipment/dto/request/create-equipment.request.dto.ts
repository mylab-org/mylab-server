import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateEquipmentRequestDto {
  @ApiProperty({ example: '공용 모니터', description: '비품 이름' })
  @IsString()
  @MinLength(1, { message: '비품 이름을 입력해주세요.' })
  @MaxLength(50, { message: '비품 이름은 50자 이하여야 합니다.' })
  name: string;

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
}
