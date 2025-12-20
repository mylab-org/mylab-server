import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const USER_ERROR: Record<string, ErrorInfo> = {
  NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },

  PASSWORD_NOT_MATCHED: {
    code: 'PASSWORD_NOT_MATCHED',
    message: '현재 비밀번호가 일치하지 않습니다',
    status: HttpStatus.BAD_REQUEST,
  },

  DUPLICATE_PHONE: {
    code: 'DUPLICATE_PHONE',
    message: '이미 사용 중인 전화번호입니다',
    status: HttpStatus.CONFLICT,
  },
} as const;
