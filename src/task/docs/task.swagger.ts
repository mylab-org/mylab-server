import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTaskRequestDto } from '../dto/request/create-task.request.dto.js';
import { UpdateTaskRequestDto } from '../dto/request/update-task.request.dto.js';
import { UpdateTaskStatusRequestDto } from '../dto/request/update-task-status.request.dto.js';
import { TaskResponseDto } from '../dto/response/task.response.dto.js';

const taskIdParam = () => ApiParam({ name: 'taskId', description: '업무 ID', type: Number });

export const ApiListTasks = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '개인 업무 및 미팅 목록 조회',
      description: '로그인한 사용자가 등록한 업무와 미팅만 조회합니다.',
    }),
    ApiResponse({ status: 200, description: '조회 성공', type: [TaskResponseDto] }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );

export const ApiCreateTask = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '개인 업무 및 미팅 등록', description: '상태는 READY로 등록됩니다.' }),
    ApiBody({ type: CreateTaskRequestDto }),
    ApiResponse({ status: 201, description: '등록 성공', type: TaskResponseDto }),
    ApiResponse({ status: 400, description: '잘못된 입력 / 종료일이 시작일보다 빠름' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );

export const ApiUpdateTask = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '개인 업무 및 미팅 수정',
      description: '보낸 필드만 수정합니다. 상태 변경은 상태 변경 API를 사용하세요.',
    }),
    taskIdParam(),
    ApiBody({ type: UpdateTaskRequestDto }),
    ApiResponse({ status: 200, description: '수정 성공', type: TaskResponseDto }),
    ApiResponse({ status: 400, description: '잘못된 입력 / 종료일이 시작일보다 빠름' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 업무' }),
  );

export const ApiUpdateTaskStatus = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '개인 업무 및 미팅 상태 변경' }),
    taskIdParam(),
    ApiBody({ type: UpdateTaskStatusRequestDto }),
    ApiResponse({ status: 200, description: '변경 성공', type: TaskResponseDto }),
    ApiResponse({ status: 400, description: '유효하지 않은 상태' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 업무' }),
  );

export const ApiDeleteTask = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '개인 업무 및 미팅 삭제' }),
    taskIdParam(),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 업무' }),
  );
