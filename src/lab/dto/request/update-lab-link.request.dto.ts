import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLabLinkRequestDto {
  @ApiPropertyOptional({ example: '연구실 홈페이지', description: '링크 제목' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '링크 제목을 입력해주세요.' })
  @MaxLength(50, { message: '링크 제목은 50자 이하여야 합니다.' })
  name?: string;

  @ApiPropertyOptional({
    example: 'https://mylab.ac.kr',
    description: '링크 주소 (http/https 포함)',
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { message: '올바른 링크 주소를 입력해주세요. (http:// 또는 https:// 포함)' },
  )
  @MaxLength(2048, { message: '링크 주소가 너무 깁니다.' })
  url?: string;
}
