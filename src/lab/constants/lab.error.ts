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

  NO_PERMISSION_TO_CHANGE_ROLE: 'L101',
  MAX_LAB_LEADER_EXCEEDED: 'L102',
  MAX_SUB_LEADER_EXCEEDED: 'L103',

  PROFESSOR_CANNOT_LEAVE: 'L201',
  NO_PERMISSION_TO_REMOVE_MEMBER: 'L202',
  CANNOT_REMOVE_SELF: 'L203',
} as const;

export const LAB_ERRORS = {
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
    code: LAB_ERROR_CODES.CODE_DEACTIVATED,
    message: '비활성화된 초대 코드.',
    status: HttpStatus.GONE,
  },
  CODE_EXPIRED: {
    code: LAB_ERROR_CODES.CODE_EXPIRED,
    message: '만료된 초대 코드.',
    status: HttpStatus.GONE,
  },
  PROFESSOR_CANNOT_LEAVE: {
    code: LAB_ERROR_CODES.PROFESSOR_CANNOT_LEAVE,
    message: '교수는 연구실을 나갈 수 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  NO_PERMISSION_TO_REMOVE_MEMBER: {
    code: LAB_ERROR_CODES.NO_PERMISSION_TO_REMOVE_MEMBER,
    message: '해당 멤버를 내보낼 권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },
  CANNOT_REMOVE_SELF: {
    code: LAB_ERROR_CODES.CANNOT_REMOVE_SELF,
    message: '본인은 내보낼 수 없습니다. 연구실 나가기를 이용해주세요.',
    status: HttpStatus.BAD_REQUEST,
  },
};

export const CHANGE_ROLE_ERROR: Record<string, ErrorInfo> = {
  NO_PERMISSION: {
    code: 'L101',
    message: '권한이 없습니다.',
    status: HttpStatus.FORBIDDEN,
  },

  MAX_LAB_LEADER_EXCEEDED: {
    code: 'L102',
    message: '랩장은 1명까지 가능합니다.',
    status: HttpStatus.CONFLICT,
  },

  MAX_SUB_LEADER_EXCEEDED: {
    code: 'L103',
    message: '부랩장은 2명까지 가능합니다.',
    status: HttpStatus.CONFLICT,
  },
};
