import { ErrorInfo } from '../../common/exceptions/common.exception.js';
import { HttpStatus } from '@nestjs/common';

export const AUTH_ERROR: Record<string, ErrorInfo> = {
  USERNAME_OR_PHONE_REQUIRED: {
    code: 'USERNAME_OR_PHONE_REQUIRED',
    message: '아이디 또는 전화번호를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  PASSWORD_REQUIRED: {
    code: 'PASSWORD_REQUIRED',
    message: '비밀번호를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: '아이디 또는 비밀번호가 올바르지 않습니다',
    status: HttpStatus.UNAUTHORIZED,
  },

  ACCESS_TOKEN_EXPIRED: {
    code: 'ACCESS_TOKEN_EXPIRED',
    message: 'Access Token이 만료되었습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_EXPIRED: {
    code: 'REFRESH_TOKEN_EXPIRED',
    message: 'Refresh Token이 만료되었습니다. 다시 로그인하세요',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_MISSING: {
    code: 'ACCESS_TOKEN_MISSING',
    message: 'Access Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_MISSING: {
    code: 'REFRESH_TOKEN_MISSING',
    message: 'Refresh Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_INVALID: {
    code: 'ACCESS_TOKEN_INVALID',
    message: '유효하지 않은 Access Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_INVALID: {
    code: 'REFRESH_TOKEN_INVALID',
    message: '유효하지 않은 Refresh Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },

  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },
};
