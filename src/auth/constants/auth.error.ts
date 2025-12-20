import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const AUTH_ERROR: Record<string, ErrorInfo> = {
  // 로그인
  USERNAME_OR_PHONE_REQUIRED: {
    code: 'USERNAME_OR_PHONE_REQUIRED',
    message: '아이디 또는 전화번호를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: '아이디 또는 비밀번호가 올바르지 않습니다',
    status: HttpStatus.UNAUTHORIZED,
  },

  // Access Token
  ACCESS_TOKEN_MISSING: {
    code: 'ACCESS_TOKEN_MISSING',
    message: 'Access Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_EXPIRED: {
    code: 'ACCESS_TOKEN_EXPIRED',
    message: 'Access Token이 만료되었습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_INVALID: {
    code: 'ACCESS_TOKEN_INVALID',
    message: '유효하지 않은 Access Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },

  // Refresh Token
  REFRESH_TOKEN_MISSING: {
    code: 'REFRESH_TOKEN_MISSING',
    message: 'Refresh Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_EXPIRED: {
    code: 'REFRESH_TOKEN_EXPIRED',
    message: 'Refresh Token이 만료되었습니다. 다시 로그인하세요',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_INVALID: {
    code: 'REFRESH_TOKEN_INVALID',
    message: '유효하지 않은 Refresh Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },

  // 회원가입
  DUPLICATE_USERNAME: {
    code: 'DUPLICATE_USERNAME',
    message: '이미 사용 중인 아이디입니다',
    status: HttpStatus.CONFLICT,
  },
  DUPLICATE_PHONE: {
    code: 'DUPLICATE_PHONE',
    message: '이미 사용 중인 전화번호입니다',
    status: HttpStatus.CONFLICT,
  },
  DUPLICATE_EMAIL: {
    code: 'DUPLICATE_EMAIL',
    message: '이미 사용 중인 이메일입니다',
    status: HttpStatus.CONFLICT,
  },

  // 공통
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },
} as const;
