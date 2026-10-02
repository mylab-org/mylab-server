import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetCategoryResponseDto } from '../dto/response/get-category.response.dto.js';
import { GetBoardResponseDto, PostItemDto } from '../dto/response/get-board.response.dto.js';

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
    ApiQuery({
      name: 'cursor',
      required: false,
      type: Number,
      description: '마지막으로 받은 게시글 id (첫 페이지는 생략, 이후 응답의 page.nextCursor 값)',
    }),
    ApiResponse({ status: 200, description: '성공', type: GetBoardResponseDto }),
  );
};

export const ApiCreateBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 작성',
    }),
    ApiResponse({ status: 200, description: '성공 — 작성된 게시글 반환', type: PostItemDto }),
  );
};

export const ApiUpdateBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 수정',
    }),
    ApiResponse({ status: 200, description: '성공 — 수정된 게시글 반환', type: PostItemDto }),
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

export const ApiLikeBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 좋아요',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};

export const ApiUnlikeBoard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '게시판 글 좋아요 해제',
    }),
    ApiResponse({ status: 200, description: '성공' }),
  );
};
