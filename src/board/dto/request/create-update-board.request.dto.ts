import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateUpdateBoardRequest {
  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  @IsString()
  title: string;

  @ApiProperty({ example: '게시글 본문', description: '게시글 본문' })
  @IsString()
  content: string;

  // Swagger에서 선택 사항임을 명시하고, 배열 내부 타입도 알려줍니다.
  @ApiPropertyOptional({
    example: ['https://example.com/image1.png', 'https://example.com/image2.png'],
    description: '첨부 이미지 경로 리스트',
    type: [String],
  })
  @IsOptional() // 값이 없어도 통과
  @IsArray() // 값이 있다면 배열이어야 함
  @IsString({ each: true }) // 배열의 각 요소는 문자열이어야 함
  Img?: string[];
}
