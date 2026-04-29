import { HttpStatus } from '@nestjs/common';

export const COMMENT_ERROR_CODES = {
  COMMENT_NOT_FOUND: 'C001',
  PARENT_COMMENT_NOT_FOUND: 'C002',
  BOARD_NOT_FOUND: 'C003',
  CATEGORIES_NOT_FOUND: 'C004',
  FAILED_TO_CREATE_COMMENT: 'C005',
  FAILED_TO_UPDATE_COMMENT: 'C006',
  FAILED_TO_DELETE_COMMENT: 'C007',
  BOARD_PERMISSION_DENIED: 'C008',
  CATEGORIES_PERMISSION_DENIED: 'C009',
  LAB_NOT_FOUND: 'C010',
  COMMENT_DELETE: 'C011',
};

export const COMMENT_ERROR = {
  COMMENT_NOT_FOUND: {
    code: COMMENT_ERROR_CODES.COMMENT_NOT_FOUND,
    message: '댓글을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  PARENT_COMMENT_NOT_FOUND: {
    code: COMMENT_ERROR_CODES.PARENT_COMMENT_NOT_FOUND,
    message: '부모 댓글을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  BOARD_NOT_FOUND: {
    code: COMMENT_ERROR_CODES.BOARD_NOT_FOUND,
    message: '게시물을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  LAB_NOT_FOUND: {
    code: COMMENT_ERROR_CODES.LAB_NOT_FOUND,
    message: '연구실이 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  CATEGORIES_NOT_FOUND: {
    code: COMMENT_ERROR_CODES.CATEGORIES_NOT_FOUND,
    message: '카테고리가 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  FAILED_TO_CREATE_COMMENT: {
    code: COMMENT_ERROR_CODES.FAILED_TO_CREATE_COMMENT,
    message: '댓글을 생성할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  FAILED_TO_UPDATE_COMMENT: {
    code: COMMENT_ERROR_CODES.FAILED_TO_UPDATE_COMMENT,
    message: '댓글을 수정할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  FAILED_TO_DELETE_COMMENT: {
    code: COMMENT_ERROR_CODES.FAILED_TO_DELETE_COMMENT,
    message: '댓글을 삭제할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  BOARD_PERMISSION_DENIED: {
    code: COMMENT_ERROR_CODES.BOARD_PERMISSION_DENIED,
    message: '게시물에 접근 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  CATEGORIES_PERMISSION_DENIED: {
    code: COMMENT_ERROR_CODES.CATEGORIES_PERMISSION_DENIED,
    message: '카테고리에 접근 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  COMMENT_DELETE: {
    code: COMMENT_ERROR_CODES.COMMENT_DELETE,
    message: '삭제된 댓글입니다.',
    status: HttpStatus.BAD_REQUEST,
  },
};
