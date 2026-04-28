import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentDto {
  @ApiProperty({ example: '10' })
  @Expose()
  id: string;

  @ApiProperty({ example: '댓글 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T03:00:00Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: { name: '오진영' } })
  @Expose()
  author: { name: string };

  @ApiProperty({ type: [CommentDto], description: '대댓글 배열', required: false })
  @Expose()
  @Type(() => CommentDto)
  replies?: CommentDto[];
}

export class GetCommentsResponseDto {
  // 댓글 데이터 추가
  @ApiProperty({ type: [CommentDto] })
  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];
}
