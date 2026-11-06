import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateLabRequestDto {
  @ApiPropertyOptional({ example: 'My lab', description: '연구실 이름' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '연구실 이름은 최소 2자 이상이어야 합니다.' })
  labName?: string;

  @ApiPropertyOptional({
    example: '딥러닝 기반 의료 영상 연구실입니다.',
    description: '연구실 소개',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['딥러닝', '의료영상'],
    description: '해시태그 (# 없이, 최대 5개, 각 20자)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: '해시태그는 최대 5개까지 가능합니다.' })
  @IsString({ each: true })
  @MaxLength(20, { each: true, message: '해시태그는 최대 20자까지 가능합니다.' })
  @Transform(({ value }: { value: unknown }) => {
    if (!Array.isArray(value)) return value;
    return (value as unknown[]).map((tag) =>
      typeof tag === 'string' ? tag.replace(/^#+/, '') : String(tag),
    );
  })
  hashtags?: string[];
}
