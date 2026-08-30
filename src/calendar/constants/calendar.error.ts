import { HttpStatus } from '@nestjs/common';

export const CALENDAR_ERROR_CODES = {
  LAB_NOT_FOUND: 'CAL001',
  USER_NOT_FOUND_IN_LAB: 'CAL002',
  INVALID_SCHEDULE_PERIOD: 'CAL003',
  PARTICIPANT_NOT_FOUND: 'CAL004',
  RECURRENCE_NOT_ALLOWED: 'CAL005',
  SCHEDULE_NOT_FOUND: 'CAL006',
  OCCURRENCE_CANCEL_NOT_ALLOWED: 'CAL007',
  OCCURRENCE_NOT_FOUND: 'CAL008',
  OCCURRENCE_ALREADY_CANCELLED: 'CAL009',
} as const;

export const CALENDAR_ERRORS = {
  LAB_NOT_FOUND: {
    code: CALENDAR_ERROR_CODES.LAB_NOT_FOUND,
    message: '존재하지 않는 연구실',
    status: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND_IN_LAB: {
    code: CALENDAR_ERROR_CODES.USER_NOT_FOUND_IN_LAB,
    message: '연구실에 존재하지 않는 사용자',
    status: HttpStatus.NOT_FOUND,
  },
  INVALID_SCHEDULE_PERIOD: {
    code: CALENDAR_ERROR_CODES.INVALID_SCHEDULE_PERIOD,
    message: '종료 일시가 시작 일시보다 빠름.',
    status: HttpStatus.BAD_REQUEST,
  },
  PARTICIPANT_NOT_FOUND: {
    code: CALENDAR_ERROR_CODES.PARTICIPANT_NOT_FOUND,
    message: '연구실에 존재하지 않는 참가 인원 포함',
    status: HttpStatus.BAD_REQUEST,
  },
  RECURRENCE_NOT_ALLOWED: {
    code: CALENDAR_ERROR_CODES.RECURRENCE_NOT_ALLOWED,
    message: 'MEETING 타입에서만 반복 설정 가능',
    status: HttpStatus.BAD_REQUEST,
  },
  SCHEDULE_NOT_FOUND: {
    code: CALENDAR_ERROR_CODES.SCHEDULE_NOT_FOUND,
    message: '존재하지 않는 일정',
    status: HttpStatus.NOT_FOUND,
  },
  OCCURRENCE_CANCEL_NOT_ALLOWED: {
    code: CALENDAR_ERROR_CODES.OCCURRENCE_CANCEL_NOT_ALLOWED,
    message: '일회성 일정은 취소(스킵) 불가능 (삭제 기능 이용)',
    status: HttpStatus.BAD_REQUEST,
  },
  OCCURRENCE_NOT_FOUND: {
    code: CALENDAR_ERROR_CODES.OCCURRENCE_NOT_FOUND,
    message: '해당 시작 일시에 존재하는 반복 일정이 없음',
    status: HttpStatus.BAD_REQUEST,
  },
  OCCURRENCE_ALREADY_CANCELLED: {
    code: CALENDAR_ERROR_CODES.OCCURRENCE_ALREADY_CANCELLED,
    message: '이미 취소(스킵)된 일정',
    status: HttpStatus.BAD_REQUEST,
  },
};
