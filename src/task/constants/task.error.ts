import { HttpStatus } from '@nestjs/common';

export const TASK_ERROR_CODES = {
  TASK_NOT_FOUND: 'T001',
  INVALID_PERIOD: 'T002',
};

export const TASK_ERROR = {
  TASK_NOT_FOUND: {
    code: TASK_ERROR_CODES.TASK_NOT_FOUND,
    message: '존재하지 않는 업무입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  INVALID_PERIOD: {
    code: TASK_ERROR_CODES.INVALID_PERIOD,
    message: '종료일은 시작일보다 빠를 수 없습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
};
