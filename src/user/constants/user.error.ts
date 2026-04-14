import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const USER_ERROR: Record<string, ErrorInfo> = {
  NOT_FOUND: {
    code: 'U101',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },

  PASSWORD_NOT_MATCHED: {
    code: 'U201',
    message: '현재 비밀번호가 일치하지 않습니다',
    status: HttpStatus.BAD_REQUEST,
  },

  DEGREE_CHANGE_NOT_ALLOWED: {
    code: 'U301',
    message: '교수는 학위를 변경할 수 없습니다',
    status: HttpStatus.BAD_REQUEST,
  },

  DEGREE_TO_PROFESSOR_NOT_ALLOWED: {
    code: 'U302',
    message: '학생은 교수로 변경할 수 없습니다',
    status: HttpStatus.BAD_REQUEST,
  },
} as const;
