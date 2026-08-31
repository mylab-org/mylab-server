import { HttpStatus } from '@nestjs/common';

export const PAPER_ERROR_CODES = {
  USER_NOT_FOUND_IN_LAB: 'PA001',
  SCHEDULE_NOT_FOUND: 'PA002',
  PAPER_NOT_FOUND: 'PA003',
  MEMBER_NOT_FOUND_IN_LAB: 'PA004',
  PERMISSION_DENIED: 'PA005',
  ALREADY_PAPER_MEMBER: 'PA006',
  CANNOT_REMOVE_LEAD_AUTHOR: 'PA007',
  PAPER_MEMBER_NOT_FOUND: 'PA008',
};

export const PAPER_ERROR = {
  USER_NOT_FOUND_IN_LAB: {
    code: PAPER_ERROR_CODES.USER_NOT_FOUND_IN_LAB,
    message: '연구실에 소속된 멤버가 아닙니다.',
    status: HttpStatus.FORBIDDEN,
  },
  SCHEDULE_NOT_FOUND: {
    code: PAPER_ERROR_CODES.SCHEDULE_NOT_FOUND,
    message: '연구실에 존재하지 않는 일정입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  PAPER_NOT_FOUND: {
    code: PAPER_ERROR_CODES.PAPER_NOT_FOUND,
    message: '존재하지 않는 논문입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  MEMBER_NOT_FOUND_IN_LAB: {
    code: PAPER_ERROR_CODES.MEMBER_NOT_FOUND_IN_LAB,
    message: '연구실에 소속되지 않은 멤버입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  PERMISSION_DENIED: {
    code: PAPER_ERROR_CODES.PERMISSION_DENIED,
    message: '권한이 없습니다. (주저자 또는 교수/랩장만 가능)',
    status: HttpStatus.FORBIDDEN,
  },
  ALREADY_PAPER_MEMBER: {
    code: PAPER_ERROR_CODES.ALREADY_PAPER_MEMBER,
    message: '이미 논문에 참여 중인 멤버입니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  CANNOT_REMOVE_LEAD_AUTHOR: {
    code: PAPER_ERROR_CODES.CANNOT_REMOVE_LEAD_AUTHOR,
    message: '주저자는 참여 멤버에서 제거할 수 없습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  PAPER_MEMBER_NOT_FOUND: {
    code: PAPER_ERROR_CODES.PAPER_MEMBER_NOT_FOUND,
    message: '논문에 참여하고 있지 않은 멤버입니다.',
    status: HttpStatus.NOT_FOUND,
  },
};
