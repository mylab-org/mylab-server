import { ApiProperty } from '@nestjs/swagger';

export class MyPostItemDto {
  @ApiProperty({ example: 1, description: '게시글 ID (상세 조회/이동용)' })
  id: number;

  @ApiProperty({ example: 2, description: '카테고리 ID (상세 화면 이동용)' })
  categoryId: number;

  @ApiProperty({ example: '자유게시판', description: '카테고리 이름' })
  categoryName: string;

  @ApiProperty({ example: '게시글 제목입니다.' })
  title: string;

  @ApiProperty({ example: '게시글 본문입니다.' })
  content: string;

  @ApiProperty({ example: '2026-04-25T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 3, description: '좋아요 수' })
  likeCount: number;

  @ApiProperty({ example: 5, description: '댓글 수' })
  commentCount: number;
}

export class MyPostsPageDto {
  @ApiProperty({
    type: Number,
    example: 82,
    nullable: true,
    description: '다음 페이지 요청 시 cursor로 보낼 값 (마지막 게시글 id)',
  })
  nextCursor: number | null;

  @ApiProperty({ example: true, description: '다음 페이지 존재 여부' })
  hasNext: boolean;
}

export class GetMyPostsResponseDto {
  @ApiProperty({ type: [MyPostItemDto] })
  posts: MyPostItemDto[];

  @ApiProperty({ type: MyPostsPageDto })
  page: MyPostsPageDto;
}
