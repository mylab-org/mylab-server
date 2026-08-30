import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetMonthlyScheduleResponseDto } from '../dto/response/get-monthly-schedule.response.dto.js';
import { CreateScheduleResponseDto } from '../dto/response/create-schedule.response.dto.js';

export function ApiCalendarCreateSchedule() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 일정 등록',
      description: '연구실에 새로운 일정 등록',
    }),
    ApiParam({ name: 'labId', description: '연구실 Id', type: Number }),
    ApiResponse({
      status: 201,
      description: '생성 성공',
      type: CreateScheduleResponseDto,
    }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({
      status: 400,
      description:
        '종료 일시가 시작 일시보다 빠름 / 연구실에 존재하지 않는 참가 인원 포함 / MEETING이 아닌 경우에 반복 설정',
    }),
    ApiResponse({
      status: 404,

      description: '존재하지 않는 연구실 / 연구실에 존재하지 않는 사용자',
    }),
  );
}

export function ApiCalendarGetMonthlySchedule() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '월간 캘린더 일정 조회',
      description: '특정 연구실의 월간 일정 날짜와 타입을 변환',
    }),
    ApiParam({ name: 'labId', description: '연구실 Id', type: Number }),
    ApiQuery({ name: 'year', description: '조회 연도', type: Number, example: 2026 }),
    ApiQuery({ name: 'month', description: '조회 월', type: Number, example: 1 }),
    ApiResponse({
      status: 200,
      description: '조회 성공',
      type: [GetMonthlyScheduleResponseDto],
    }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({
      status: 404,
      description: '존재하지 않는 연구실 / 연구실에 존재하지 않는 사용자',
    }),
  );
}

export function ApiCalendarUpdateSchedule() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 일정 수정',
      description: '연구실 일정 부분 수정 (PATCH, 보낸 필드만 반영)',
    }),
    ApiParam({ name: 'labId', description: '연구실 Id', type: Number }),
    ApiParam({ name: 'scheduleId', description: '일정 Id', type: Number }),
    ApiResponse({
      status: 200,
      description: '수정 성공',
      type: CreateScheduleResponseDto,
    }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({
      status: 400,
      description:
        '종료 일시가 시작 일시보다 빠름 / 연구실에 존재하지 않는 참가 인원 포함 / MEETING이 아닌 경우에 반복 설정',
    }),
    ApiResponse({
      status: 404,
      description: '존재하지 않는 연구실 / 연구실에 존재하지 않는 사용자 / 존재하지 않는 일정',
    }),
  );
}

export function ApiCalendarDeleteSchedule() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 일정 삭제',
      description:
        '연구실 일정을 삭제 (반복 일정은 시리즈 전체 삭제). 연결된 논문(papers)은 삭제되지 않고 일정과의 연결만 끊어짐',
    }),
    ApiParam({ name: 'labId', description: '연구실 Id', type: Number }),
    ApiParam({ name: 'scheduleId', description: '일정 Id', type: Number }),
    ApiResponse({ status: 204, description: '삭제 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({
      status: 404,
      description: '존재하지 않는 연구실 / 연구실에 존재하지 않는 사용자 / 존재하지 않는 일정',
    }),
  );
}

export function ApiCalendarCancelOccurrence() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '반복 일정 중 하루 취소(스킵)',
      description:
        '반복 일정(recurrence_type != NONE)에서 특정 회차만 취소(스킵) 처리. 시리즈는 삭제되지 않고, 월간 조회 시 해당 회차가 is_cancelled: true로 표시됨',
    }),
    ApiParam({ name: 'labId', description: '연구실 Id', type: Number }),
    ApiParam({ name: 'scheduleId', description: '일정 Id', type: Number }),
    ApiQuery({
      name: 'occurrence_at',
      description: '취소할 회차의 원래 시작 일시',
      example: '2026-01-05T10:00:00.000Z',
    }),
    ApiResponse({ status: 204, description: '취소 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({
      status: 400,
      description:
        '일회성 일정에는 회차 취소 사용 불가 / 해당 시작 일시에 존재하는 회차 없음 / 이미 취소된 회차',
    }),
    ApiResponse({
      status: 404,
      description: '존재하지 않는 연구실 / 연구실에 존재하지 않는 사용자 / 존재하지 않는 일정',
    }),
  );
}
