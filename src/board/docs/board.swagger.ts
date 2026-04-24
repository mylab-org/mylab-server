import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetCategoryResponseDto } from '../dto/response/get-category.response.dto.js';
import { GetPostResponseDto } from '../dto/response/get-board.response.dto.js';

export const ApiGetCategory = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 카테고리 조회',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 200, description: '조회 성공', type: GetCategoryResponseDto }),
  );
};

export const ApiGetBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 목록 조회',
    }),
    ApiParam({ name: 'categoryId', description: '카테고리 ID', type: Number }),
  );
};

export const ApiCreateBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 작성',
    }),
    ApiResponse({ status: 200, description: '성공', type: GetPostResponseDto }),
  );
};

export const ApiUpdateBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 수정',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};

export const ApiDeleteBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 삭제',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};
