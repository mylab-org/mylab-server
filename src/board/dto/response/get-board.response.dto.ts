import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty({ example: '1', description: '작성자 ID' })
  @Expose()
  id: string;

  @ApiProperty({ example: '홍길동', description: '작성자 이름' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'MASTER', description: '학위' })
  @Expose()
  degree: string;
}

export class PostLabDto {
  @ApiProperty({ example: '1', description: '연구실 ID' })
  @Expose()
  id: string;

  @ApiProperty({ example: '인공지능 연구실', description: '연구실 이름' })
  @Expose()
  name: string;
}

export class GetPostResponseDto {
  @ApiProperty({ example: '1' })
  @Expose()
  id: string;

  @ApiProperty({ example: '게시글 제목' })
  @Expose()
  title: string;

  @ApiProperty({ example: '게시글 내용' })
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  created_at: Date;

  @ApiProperty()
  @Expose()
  updated_at: Date;

  @ApiProperty({ example: 0 })
  @Expose()
  like_count: number;

  @ApiProperty({ type: PostAuthorDto }) // 객체 타입 명시
  @Expose()
  @Type(() => PostAuthorDto)
  author: PostAuthorDto;

  @ApiProperty({ type: PostLabDto, nullable: true }) // Transform되는 필드도 타입을 명시
  @Expose()
  @Transform(({ obj }) => {
    const lab = obj.author?.lab_members?.[0]?.labs;
    return lab ? { id: lab.id.toString(), name: lab.name } : null;
  })
  lab: PostLabDto;
}
