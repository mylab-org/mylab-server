import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUpdateCommentRequestDto {
  @ApiProperty({ example: 1, description: '부모 댓글 ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId: number;

  @ApiProperty({ example: '댓글 내용', description: '댓글 내용' })
  @IsString()
  content: string;
}
