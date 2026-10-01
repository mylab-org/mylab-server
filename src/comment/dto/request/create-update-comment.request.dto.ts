import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUpdateCommentRequestDto {
  @ApiProperty({ example: 1, description: '부모 댓글 ID', required: false })
  @IsNumber()
  @IsOptional()
  parentId: number;

  @ApiProperty({ example: '댓글 내용', description: '댓글 내용' })
  @IsString()
  content: string;

  @ApiProperty({
    example: false,
    description: '익명 작성 여부 (작성 시에만 적용)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
