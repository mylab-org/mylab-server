import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const LAB_ERROR_CODES = {
  USER_NOT_FOUND: 'L001',
  USER_NOT_FOUND_IN_LAB: 'L002',
  NOT_VERIFIED_PROFESSOR: 'L003',
  ALREADY_IN_LAB: 'L004',
  LAB_NOT_FOUND: 'L005',
  FAILED_TO_CREATE_INVITE_CODE: 'L006',
  PERMISSION_DENIED: 'L007',
  CODE_NOT_FOUND: 'L008',
  CODE_DEACTIVATED: 'L009',
  CODE_EXPIRED: 'L010',
} as const;

export type LabErrorCode = (typeof LAB_ERROR_CODES)[keyof typeof LAB_ERROR_CODES];

export const LAB_ERRORS: Record<string, ErrorInfo> = {
  USER_NOT_FOUND: {
    code: LAB_ERROR_CODES.USER_NOT_FOUND,
    message: '존재하지 않는 사용자.',
    status: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND_IN_LAB: {
    code: LAB_ERROR_CODES.USER_NOT_FOUND_IN_LAB,
    message: '연구실에 존재하지 않는 사용자.',
    status: HttpStatus.NOT_FOUND,
  },
  NOT_VERIFIED_PROFESSOR: {
    code: LAB_ERROR_CODES.NOT_VERIFIED_PROFESSOR,
    message: '인증되지 않은 교수.',
    status: HttpStatus.FORBIDDEN,
  },
  ALREADY_IN_LAB: {
    code: LAB_ERROR_CODES.ALREADY_IN_LAB,
    message: '이미 연구실에 소속된 사용자.',
    status: HttpStatus.CONFLICT,
  },
  LAB_NOT_FOUND: {
    code: LAB_ERROR_CODES.LAB_NOT_FOUND,
    message: '해당 연구실을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  FAILED_TO_CREATE_INVITE_CODE: {
    code: LAB_ERROR_CODES.FAILED_TO_CREATE_INVITE_CODE,
    message: '연구실 초대 코드 생성 실패.',
    status: HttpStatus.CONFLICT,
  },
  PERMISSION_DENIED: {
    code: LAB_ERROR_CODES.PERMISSION_DENIED,
    message: '권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  CODE_NOT_FOUND: {
    code: LAB_ERROR_CODES.CODE_NOT_FOUND,
    message: '존재하지 않는 초대 코드.',
    status: HttpStatus.NOT_FOUND,
  },
  CODE_DEACTIVATED: {
    code: LAB_ERROR_CODES.CODE_EXPIRED,
    message: '비활성화된 초대 코드.',
    status: HttpStatus.GONE,
  },
  CODE_EXPIRED: {
    code: LAB_ERROR_CODES.CODE_EXPIRED,
    message: '만료된 초대 코드.',
    status: HttpStatus.GONE,
  },
};
