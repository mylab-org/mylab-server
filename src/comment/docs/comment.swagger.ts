import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getCommentResponseDto } from '../dto/response/get-comment-response.dto.js';

export const ApiGetComment = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시글 댓글 목록 조회',
    }),
    ApiResponse({ status: 200, description: '성공', type: getCommentResponseDto }),
  );
};

export const ApiCreateComment = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시글 댓글 및 대댓글 작성',
    }),

    ApiResponse({ status: 200, description: '성공' }),
  );
};

export const ApiUpdateComment = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시글 댓글 및 대댓글 수정',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};

export const ApiDeleteComment = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시글 댓글 및 대댓글 삭제',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};
