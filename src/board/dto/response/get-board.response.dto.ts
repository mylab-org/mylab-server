import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { BoardAuthorDto, BoardLabDto } from './create-board.response.dto.js';

// [1] 개별 게시글 DTO
export class PostItemDto {
  @ApiProperty({ example: '1' })
  @Expose()
  id: string;

  @ApiProperty({ example: '게시글 제목입니다.' })
  @Expose()
  title: string;

  @ApiProperty({ example: '게시글 본문입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T00:00:00Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ type: BoardAuthorDto })
  @Expose()
  @Type(() => BoardAuthorDto)
  author: BoardAuthorDto;

  @ApiProperty({ type: BoardLabDto, nullable: true })
  @Expose()
  @Transform(({ obj }) => {
    const currentObj = obj as {
      author?: {
        lab_members?: Array<{
          labs?: { id: number | bigint; name: string };
        }>;
      };
    };

    const lab = currentObj.author?.lab_members?.[0]?.labs;
    return lab ? { id: lab.id.toString(), name: lab.name } : null;
  })
  lab: BoardLabDto;

  @ApiProperty({ example: 5 })
  @Expose()
  @Transform(({ obj }) => {
    const source = obj as { _count?: { comments: number } };
    return source._count?.comments ?? 0;
  })
  commentCount: number;
}

// [2] 페이지 메타 정보 DTO
export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  @Expose()
  currentPage: number;

  @ApiProperty({ example: 20 })
  @Expose()
  pageSize: number;

  @ApiProperty({ example: 100 })
  @Expose()
  totalCount: number;

  @ApiProperty({ example: 5 })
  @Expose()
  totalPages: number;
}

// [3] 최종 전체 응답 DTO
export class GetBoardResponseDto {
  @ApiProperty({ type: [PostItemDto] })
  @Expose()
  @Type(() => PostItemDto)
  posts: PostItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  page: PaginationMetaDto;
}
