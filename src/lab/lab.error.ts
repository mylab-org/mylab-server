import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../common/exceptions/common.exception.js';

export const LAB_ERRORS: Record<string, ErrorInfo> = {
  USER_NOT_FOUND: {
    code: 'LAB001',
    message: '존재하지 않는 사용자.',
    status: HttpStatus.BAD_REQUEST,
  },
  NOT_VERIFIED_PROFESSOR: {
    code: 'LAB002',
    message: '인증되지 않은 교수.',
    status: HttpStatus.BAD_REQUEST,
  },
  NOT_VERIFIED_PROFESSOR_PENDING: {
    code: 'LAB003',
    message: '인증 대기중인 교수.',
    status: HttpStatus.BAD_REQUEST,
  },
  ALREADY_IN_LAB: {
    code: 'LAB004',
    message: '이미 연구실에 소속된 사용자.',
    status: HttpStatus.BAD_REQUEST,
  },
};
