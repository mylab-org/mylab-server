import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class AuthorDto {
  @ApiProperty({ example: '테스트' })
  @Expose()
  name: string | null;

  @ApiProperty({
    type: String,
    example: '인공지능 연구실',
    nullable: true,
    description: '작성자 소속 연구실 이름',
  })
  @Expose()
  @Transform(({ obj }) => {
    const currentObj = obj as { lab_members?: Array<{ labs?: { name: string } }> };
    return currentObj.lab_members?.[0]?.labs?.name ?? null;
  })
  labName: string | null;
}

export class ReplyCommentResponseDto {
  @ApiProperty({ example: 2 })
  @Expose()
  @Transform(({ obj }) => Number((obj as { id: number | bigint }).id))
  cid: number;

  @ApiProperty({ example: '대댓글 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T03:00:00Z' })
  @Expose()
  @Transform(({ obj }) => (obj as { created_at: Date }).created_at)
  createdAt: Date;

  @ApiProperty({ type: AuthorDto, nullable: true })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto | null;
}

export class getCommentResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  @Transform(({ obj }) => Number((obj as { id: number | bigint }).id))
  cid: number;

  @ApiProperty({ example: '댓글 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T03:00:00Z' })
  @Expose()
  @Transform(({ obj }) => (obj as { created_at: Date }).created_at)
  createdAt: Date;

  // 삭제된 경우 null이 될 수 있으므로 처리
  @ApiProperty({ type: AuthorDto, nullable: true })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto | null;

  @ApiProperty({ type: [ReplyCommentResponseDto], description: '대댓글 배열' })
  @Expose()
  @Type(() => ReplyCommentResponseDto)
  replies: ReplyCommentResponseDto[];
}
