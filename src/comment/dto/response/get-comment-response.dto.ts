import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AuthorDto {
  @ApiProperty({ example: '테스트' })
  @Expose()
  name: string | null;
}

export class getCommentResponseDto {
  @ApiProperty({ example: '1' })
  @Expose()
  // @Transform(({ value }) => value.toString()) // BigInt를 문자열로 변환
  id: string;

  @ApiProperty({ example: '댓글 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2026-04-25T03:00:00Z' })
  @Expose()
  created_at: Date;

  // 삭제된 경우 null이 될 수 있으므로 처리
  @ApiProperty({ type: AuthorDto, nullable: true })
  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto | null;

  @ApiProperty({ type: [getCommentResponseDto], description: '대댓글 배열' })
  @Expose()
  @Type(() => getCommentResponseDto)
  replies: getCommentResponseDto[];
}
