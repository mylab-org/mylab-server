import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'A001',
  ACCESS_TOKEN_MISSING: 'A002',
  ACCESS_TOKEN_EXPIRED: 'A003',
  ACCESS_TOKEN_INVALID: 'A004',
  REFRESH_TOKEN_MISSING: 'A005',
  REFRESH_TOKEN_EXPIRED: 'A006',
  REFRESH_TOKEN_INVALID: 'A007',
  DUPLICATE_EMAIL: 'A008',
  USER_NOT_FOUND: 'A009',
  EMAIL_NOT_VERIFIED: 'A010',
  ALREADY_VERIFIED: 'A011',
  INVALID_OR_EXPIRED_TOKEN: 'A012',
  TOO_MANY_REQUESTS: 'A013',
  DAILY_LIMIT_EXCEEDED: 'A014',
  EMAIL_SEND_FAILED: 'A015',
} as const;

export const AUTH_ERROR: Record<string, ErrorInfo> = {
  INVALID_CREDENTIALS: {
    code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
    message: '이메일 또는 비밀번호가 올바르지 않습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_MISSING: {
    code: AUTH_ERROR_CODES.ACCESS_TOKEN_MISSING,
    message: 'Access Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_EXPIRED: {
    code: AUTH_ERROR_CODES.ACCESS_TOKEN_EXPIRED,
    message: 'Access Token이 만료되었습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  ACCESS_TOKEN_INVALID: {
    code: AUTH_ERROR_CODES.ACCESS_TOKEN_INVALID,
    message: '유효하지 않은 Access Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_MISSING: {
    code: AUTH_ERROR_CODES.REFRESH_TOKEN_MISSING,
    message: 'Refresh Token이 없습니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_EXPIRED: {
    code: AUTH_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
    message: 'Refresh Token이 만료되었습니다. 다시 로그인하세요',
    status: HttpStatus.UNAUTHORIZED,
  },
  REFRESH_TOKEN_INVALID: {
    code: AUTH_ERROR_CODES.REFRESH_TOKEN_INVALID,
    message: '유효하지 않은 Refresh Token입니다',
    status: HttpStatus.UNAUTHORIZED,
  },
  DUPLICATE_EMAIL: {
    code: AUTH_ERROR_CODES.DUPLICATE_EMAIL,
    message: '이미 사용 중인 이메일입니다',
    status: HttpStatus.CONFLICT,
  },
  USER_NOT_FOUND: {
    code: AUTH_ERROR_CODES.USER_NOT_FOUND,
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },
  EMAIL_NOT_VERIFIED: {
    code: AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED,
    message: '이메일 인증이 완료되지 않았습니다',
    status: HttpStatus.FORBIDDEN,
  },
  ALREADY_VERIFIED: {
    code: AUTH_ERROR_CODES.ALREADY_VERIFIED,
    message: '이미 인증된 사용자입니다',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_OR_EXPIRED_TOKEN: {
    code: AUTH_ERROR_CODES.INVALID_OR_EXPIRED_TOKEN,
    message: '유효하지 않거나 만료된 인증 토큰입니다',
    status: HttpStatus.BAD_REQUEST,
  },
  TOO_MANY_REQUESTS: {
    code: AUTH_ERROR_CODES.TOO_MANY_REQUESTS,
    message: '1분 후에 다시 시도해주세요',
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
  DAILY_LIMIT_EXCEEDED: {
    code: AUTH_ERROR_CODES.DAILY_LIMIT_EXCEEDED,
    message: '오늘 최대 5회 발송 가능합니다',
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
  EMAIL_SEND_FAILED: {
    code: AUTH_ERROR_CODES.EMAIL_SEND_FAILED,
    message: '이메일 발송 실패. 잠시 후 다시 시도해주세요',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const;
