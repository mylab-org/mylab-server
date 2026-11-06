import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateLabLinkRequestDto {
  @ApiProperty({ example: '연구실 홈페이지', description: '링크 이름 (최대 20자)' })
  @IsString()
  @MinLength(1, { message: '링크 이름은 비워둘 수 없습니다.' })
  @MaxLength(20, { message: '링크 이름은 최대 20자까지 가능합니다.' })
  name: string;

  @ApiProperty({ example: 'https://example.com', description: '링크 URL' })
  @IsString()
  @IsUrl({}, { message: '유효한 URL 형식이 아닙니다.' })
  url: string;
}
