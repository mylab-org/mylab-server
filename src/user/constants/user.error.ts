import { HttpStatus } from '@nestjs/common';
import { ErrorInfo } from '../../common/exceptions/common.exception.js';

export const USER_ERROR: Record<string, ErrorInfo> = {
  USERNAME_REQUIRED: {
    code: 'USERNAME_REQUIRED',
    message: '아이디를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  PHONE_REQUIRED: {
    code: 'PHONE_REQUIRED',
    message: '전화번호를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  PASSWORD_REQUIRED: {
    code: 'PASSWORD_REQUIRED',
    message: '비밀번호를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  NAME_REQUIRED: {
    code: 'NAME_REQUIRED',
    message: '이름을 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  DEGREE_REQUIRED: {
    code: 'DEGREE_REQUIRED',
    message: '학위를 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },
  EMAIL_REQUIRED: {
    code: 'EMAIL_REQUIRED',
    message: '교수는 이메일을 입력하세요',
    status: HttpStatus.BAD_REQUEST,
  },

  PHONE_INVALID: {
    code: 'PHONE_INVALID',
    message: '올바른 전화번호 형식이 아닙니다',
    status: HttpStatus.BAD_REQUEST,
  },
  EMAIL_INVALID: {
    code: 'USER_EMAIL_INVALID',
    message: '올바른 이메일 형식이 아닙니다',
    status: HttpStatus.BAD_REQUEST,
  },
  PASSWORD_TOO_SHORT: {
    code: 'PASSWORD_TOO_SHORT',
    message: '비밀번호는 최소 8자 이상이어야 합니다',
    status: HttpStatus.BAD_REQUEST,
  },
  IS_NOT_MATCHED_PASSWORD: {
    code: 'IS_NOT_MATCHED_PASSWORD',
    message: '비밀번호가 일치하지 않습니다',
    status: HttpStatus.BAD_REQUEST,
  },

  DUPLICATE_EMAIL: {
    code: 'DUPLICATE_EMAIL',
    message: '이미 사용 중인 이메일입니다',
    status: HttpStatus.CONFLICT,
  },
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

  NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다',
    status: HttpStatus.NOT_FOUND,
  },
} as const;
