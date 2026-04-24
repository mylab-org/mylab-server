import { ApiProperty } from '@nestjs/swagger';

export class CategoryItemDto {
  @ApiProperty({ description: '카테고리 ID', example: '1' })
  category_id: string;

  @ApiProperty({ description: '카테고리 이름', example: '자유게시판' })
  category_name: string;
}

export class GetCategoryResponseDto {
  @ApiProperty({
    description: '서비스 전체 카테고리 목록',
    type: [CategoryItemDto], // 배열임을 명시하고 타입을 연결합니다.
  })
  service: CategoryItemDto[];

  @ApiProperty({
    description: '연구실 전용 카테고리 목록',
    type: [CategoryItemDto],
  })
  lab: CategoryItemDto[];
}
