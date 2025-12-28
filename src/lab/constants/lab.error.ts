import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const LAB_ERRORS: Record<string, ErrorInfo> = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '존재하지 않는 사용자.',
    status: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND_IN_LAB: {
    code: 'USER_NOT_FOUND_IN_LAB',
    message: '연구실에 존재하지 않는 사용자.',
    status: HttpStatus.NOT_FOUND,
  },
  NOT_VERIFIED_PROFESSOR: {
    code: 'NOT_VERIFIED_PROFESSOR',
    message: '인증되지 않은 교수.',
    status: HttpStatus.FORBIDDEN,
  },
  ALREADY_IN_LAB: {
    code: 'ALREADY_IN_LAB',
    message: '이미 연구실에 소속된 사용자.',
    status: HttpStatus.CONFLICT,
  },
  LAB_NOT_FOUND: {
    code: 'LAB_NOT_FOUND',
    message: '해당 연구실을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  FAILED_TO_CREATE_INVITE_CODE: {
    code: 'FAILED_TO_CREATE_INVITE_CODE',
    message: '연구실 초대 코드 생성 실패.',
    status: HttpStatus.CONFLICT,
  },
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: '권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  CODE_NOT_FOUND: {
    code: 'CODE_NOT_FOUND',
    message: '존재하지 않는 초대 코드.',
    status: HttpStatus.NOT_FOUND,
  },
  CODE_DEACTIVATED: {
    code: 'CODE_DEACTIVATED',
    message: '비활성화된 초대 코드.',
    status: HttpStatus.GONE,
  },
  CODE_EXPIRED: {
    code: 'CODE_EXPIRED',
    message: '만료된 초대 코드.',
    status: HttpStatus.GONE,
  },
};
