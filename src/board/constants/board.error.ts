import { HttpStatus } from '@nestjs/common';

export const BOARD_ERROR_CODES = {
  USER_NOT_FOUND: 'B001',
  BOARD_NOT_FOUND: 'B002',
  CATEGORIES_NOT_FOUND: 'B003',
  FAILED_TO_CREATE_BOARD: 'B004',
  FAILED_TO_UPDATE_BOARD: 'B005',
  FAILED_TO_DELETE_BOARD: 'B006',
  BOARD_PERMISSION_DENIED: 'B007',
  CATEGORIES_PERMISSION_DENIED: 'B008',
  LAB_NOT_FOUND: 'B009',
  ALREADY_LIKED: 'B010',
  LIKE_NOT_FOUND: 'B011',
};

export const BOARD_ERROR = {
  USER_NOT_FOUND: {
    code: BOARD_ERROR_CODES.USER_NOT_FOUND,
    message: '사용자를 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  BOARD_NOT_FOUND: {
    code: BOARD_ERROR_CODES.BOARD_NOT_FOUND,
    message: '게시물이 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  CATEGORIES_NOT_FOUND: {
    code: BOARD_ERROR_CODES.CATEGORIES_NOT_FOUND,
    message: '카테고리가 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  LAB_NOT_FOUND: {
    code: BOARD_ERROR_CODES.LAB_NOT_FOUND,
    message: '연구실이 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  FAILED_TO_CREATE_BOARD: {
    code: BOARD_ERROR_CODES.FAILED_TO_CREATE_BOARD,
    message: '게시물을 생성할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  FAILED_TO_UPDATE_BOARD: {
    code: BOARD_ERROR_CODES.FAILED_TO_UPDATE_BOARD,
    message: '게시물을 수정할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  FAILED_TO_DELETE_BOARD: {
    code: BOARD_ERROR_CODES.FAILED_TO_DELETE_BOARD,
    message: '게시물을 삭제할 수 없습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  BOARD_PERMISSION_DENIED: {
    code: BOARD_ERROR_CODES.BOARD_PERMISSION_DENIED,
    message: '게시물에 접근 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  CATEGORIES_PERMISSION_DENIED: {
    code: BOARD_ERROR_CODES.CATEGORIES_PERMISSION_DENIED,
    message: '카테고리에 접근 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  ALREADY_LIKED: {
    code: BOARD_ERROR_CODES.ALREADY_LIKED,
    message: '이미 좋아요한 게시물입니다.',
    status: HttpStatus.CONFLICT,
  },
  LIKE_NOT_FOUND: {
    code: BOARD_ERROR_CODES.LIKE_NOT_FOUND,
    message: '좋아요 기록이 존재하지 않습니다.',
    status: HttpStatus.NOT_FOUND,
  },
};
