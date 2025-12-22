import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const VERIFY_ERROR: Record<string, ErrorInfo> = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },

  NOT_PROFESSOR: {
    code: 'NOT_PROFESSOR',
    message: '교수만 이메일 인증이 가능합니다',
    status: HttpStatus.BAD_REQUEST,
  },
  ALREADY_VERIFIED: {
    code: 'ALREADY_VERIFIED',
    message: '이미 인증된 이메일입니다',
    status: HttpStatus.BAD_REQUEST,
  },

  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: '유효하지 않은 인증 토큰입니다',
    status: HttpStatus.BAD_REQUEST,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: '인증 토큰이 만료되었습니다',
    status: HttpStatus.BAD_REQUEST,
  },

  TOO_MANY_REQUESTS: {
    code: 'TOO_MANY_REQUESTS',
    message: '재발송은 60초 후에 가능합니다',
    status: HttpStatus.TOO_MANY_REQUESTS,
  },
} as const;
