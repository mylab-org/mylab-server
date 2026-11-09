import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLabRequestDto {
  @ApiPropertyOptional({ example: '마이랩 연구실', description: '연구실 이름' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '연구실 이름은 최소 2자 이상이어야 합니다.' })
  labName?: string;

  @ApiPropertyOptional({
    example: '본 연구실은 광대역 지능형 통신 네트워크를 연구합니다.',
    description: '연구실 소개',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '연구실 소개는 500자 이하여야 합니다.' })
  description?: string;

  @ApiPropertyOptional({
    example: ['무선 네트워크', '스마트 IoT'],
    description: '연구 분야 (최대 10개, 전체 교체)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: '연구 분야는 최대 10개까지 등록할 수 있습니다.' })
  @IsString({ each: true })
  @MaxLength(30, { each: true, message: '연구 분야는 30자 이하여야 합니다.' })
  researchFields?: string[];
}
