import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

const getAuthorLab = (obj: unknown) => {
  const currentObj = obj as {
    lab_members?: Array<{
      labs?: { id: number | bigint; name: string };
    }>;
  };

  return currentObj.lab_members?.[0]?.labs;
};

export class BoardAuthorDto {
  @ApiProperty({
    type: Number,
    example: 1,
    nullable: true,
    description: '작성자 ID (익명이면 null)',
  })
  @Expose()
  @Transform(({ obj }) => {
    const id = (obj as { id: number | bigint | null }).id;
    return id === null ? null : Number(id);
  })
  uid: number | null;

  @ApiProperty({ example: '홍길동', description: '작성자 이름 (익명이면 "익명")' })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: 'MASTER',
    nullable: true,
    description: '학위 (익명이면 null)',
  })
  @Expose()
  degree: string | null;

  @ApiProperty({ example: 1, nullable: true, description: '작성자 소속 연구실 ID' })
  @Expose()
  @Transform(({ obj }) => {
    const lab = getAuthorLab(obj);
    return lab ? Number(lab.id) : null;
  })
  labId: number | null;

  @ApiProperty({
    example: '인공지능 연구실',
    nullable: true,
    description: '작성자 소속 연구실 이름',
  })
  @Expose()
  @Transform(({ obj }) => getAuthorLab(obj)?.name ?? null)
  labName: string | null;
}

// [1] 개별 게시글 dto
export class PostItemDto {
  @ApiProperty({ example: 1 })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ApiProperty({ example: '게시글 제목입니다.' })
  @Expose()
  title: string;

  @ApiProperty({ example: '게시글 본문입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T00:00:00Z' })
  @Expose()
  @Transform(({ obj }) => (obj as { created_at: Date }).created_at)
  createdAt: Date;

  @ApiProperty({ type: BoardAuthorDto })
  @Expose()
  @Type(() => BoardAuthorDto)
  author: BoardAuthorDto;

  @ApiProperty({ example: 3, description: '좋아요 수' })
  @Expose()
  @Transform(({ obj }) => (obj as { like_count: number }).like_count)
  likeCount: number;

  @ApiProperty({ example: true, description: '로그인한 사용자의 좋아요 여부' })
  @Expose()
  @Transform(({ obj }) => {
    const source = obj as { post_likes?: unknown[] };
    return (source.post_likes?.length ?? 0) > 0;
  })
  isLiked: boolean;

  @ApiProperty({ example: false, description: '익명 게시글 여부' })
  @Expose()
  @Transform(({ obj }) => (obj as { is_anonymous: boolean }).is_anonymous)
  isAnonymous: boolean;

  @ApiProperty({
    example: true,
    description: '로그인한 사용자가 작성한 게시글인지 (수정/삭제 버튼 노출용)',
  })
  @Expose()
  @Transform(({ obj }) => (obj as { is_mine: boolean }).is_mine)
  isMine: boolean;

  @ApiProperty({ example: 5 })
  @Expose()
  @Transform(({ obj }) => {
    const source = obj as { _count?: { comments: number } };
    return source._count?.comments ?? 0;
  })
  commentCount: number;
}

// [2] 페이지 메타 정보 dto
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

// [3] 최종 전체 응답 dto
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
