import { HttpStatus } from '@nestjs/common';

export const EQUIPMENT_ERROR_CODES = {
  USER_NOT_FOUND_IN_LAB: 'EQ001',
  PERMISSION_DENIED: 'EQ002',
  EQUIPMENT_NOT_FOUND: 'EQ003',
  EQUIPMENT_NOT_RENTABLE: 'EQ004',
  INVALID_RENTAL_PERIOD: 'EQ005',
  RENTAL_TIME_CONFLICT: 'EQ006',
  RENTAL_NOT_FOUND: 'EQ007',
  NOT_RENTAL_OWNER: 'EQ008',
  REQUEST_NOT_FOUND: 'EQ009',
  REQUEST_ALREADY_REVIEWED: 'EQ010',
} as const;

export const EQUIPMENT_ERRORS = {
  USER_NOT_FOUND_IN_LAB: {
    code: EQUIPMENT_ERROR_CODES.USER_NOT_FOUND_IN_LAB,
    message: '연구실에 존재하지 않는 사용자',
    status: HttpStatus.NOT_FOUND,
  },
  PERMISSION_DENIED: {
    code: EQUIPMENT_ERROR_CODES.PERMISSION_DENIED,
    message: '권한이 없습니다. (교수/랩장만 가능)',
    status: HttpStatus.FORBIDDEN,
  },
  EQUIPMENT_NOT_FOUND: {
    code: EQUIPMENT_ERROR_CODES.EQUIPMENT_NOT_FOUND,
    message: '존재하지 않는 비품',
    status: HttpStatus.NOT_FOUND,
  },
  EQUIPMENT_NOT_RENTABLE: {
    code: EQUIPMENT_ERROR_CODES.EQUIPMENT_NOT_RENTABLE,
    message: '대여가 비활성화된 비품',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_RENTAL_PERIOD: {
    code: EQUIPMENT_ERROR_CODES.INVALID_RENTAL_PERIOD,
    message: '대여 기간이 올바르지 않음 (반납 일시는 대여 일시 이후, 지난 시간 불가, 최대 30일)',
    status: HttpStatus.BAD_REQUEST,
  },
  RENTAL_TIME_CONFLICT: {
    code: EQUIPMENT_ERROR_CODES.RENTAL_TIME_CONFLICT,
    message: '해당 시간에 이미 대여가 있습니다',
    status: HttpStatus.CONFLICT,
  },
  RENTAL_NOT_FOUND: {
    code: EQUIPMENT_ERROR_CODES.RENTAL_NOT_FOUND,
    message: '존재하지 않는 대여',
    status: HttpStatus.NOT_FOUND,
  },
  NOT_RENTAL_OWNER: {
    code: EQUIPMENT_ERROR_CODES.NOT_RENTAL_OWNER,
    message: '본인의 대여만 변경·취소할 수 있습니다',
    status: HttpStatus.FORBIDDEN,
  },
  REQUEST_NOT_FOUND: {
    code: EQUIPMENT_ERROR_CODES.REQUEST_NOT_FOUND,
    message: '존재하지 않는 비품 신청',
    status: HttpStatus.NOT_FOUND,
  },
  REQUEST_ALREADY_REVIEWED: {
    code: EQUIPMENT_ERROR_CODES.REQUEST_ALREADY_REVIEWED,
    message: '이미 승인/반려된 신청은 취소할 수 없습니다',
    status: HttpStatus.CONFLICT,
  },
};
