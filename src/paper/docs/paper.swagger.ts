import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaperResponseDto } from '../dto/response/paper.response.dto.js';
import { CreatePaperRequestDto } from '../dto/request/create-paper.request.dto.js';
import { UpdatePaperStatusRequestDto } from '../dto/request/update-paper-status.request.dto.js';
import { UpdatePaperRequestDto } from '../dto/request/update-paper.request.dto.js';
import { AddPaperMemberRequestDto } from '../dto/request/add-paper-member.request.dto.js';

const labIdParam = () => ApiParam({ name: 'labId', description: '연구실 ID', type: Number });
const paperIdParam = () => ApiParam({ name: 'paperId', description: '논문 ID', type: Number });

export const ApiCreatePaper = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '논문 등록',
      description:
        '연구실에 논문(연구 프로젝트)을 새로 등록. leadAuthorUserId 미지정 시 작성자 본인이 주저자가 됨.',
    }),
    labIdParam(),
    ApiBody({ type: CreatePaperRequestDto }),
    ApiResponse({ status: 201, description: '등록 성공', type: PaperResponseDto }),
    ApiResponse({ status: 403, description: '연구실 멤버가 아님' }),
    ApiResponse({ status: 404, description: '존재하지 않는 일정 / 존재하지 않는 참여자' }),
  );

export const ApiListPapers = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '논문 목록 조회' }),
    labIdParam(),
    ApiResponse({ status: 200, description: '조회 성공', type: [PaperResponseDto] }),
    ApiResponse({ status: 403, description: '연구실 멤버가 아님' }),
  );

export const ApiGetPaper = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '논문 상세 조회' }),
    labIdParam(),
    paperIdParam(),
    ApiResponse({ status: 200, description: '조회 성공', type: PaperResponseDto }),
    ApiResponse({ status: 403, description: '연구실 멤버가 아님' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문' }),
  );

export const ApiUpdatePaper = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '논문 정보 수정',
      description:
        '제목, 주저자, 연결된 일정을 수정. 주저자 또는 교수/랩장만 가능. 주저자를 바꾸면 기존 주저자는 공동저자가 되고, 새 주저자가 참여자에 없으면 자동 추가됨.',
    }),
    labIdParam(),
    paperIdParam(),
    ApiBody({ type: UpdatePaperRequestDto }),
    ApiResponse({ status: 200, description: '수정 성공', type: PaperResponseDto }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문 / 일정 / 멤버' }),
  );

export const ApiUpdatePaperStatus = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '논문 상태 변경', description: '주저자 또는 교수/랩장만 변경 가능' }),
    labIdParam(),
    paperIdParam(),
    ApiBody({ type: UpdatePaperStatusRequestDto }),
    ApiResponse({ status: 200, description: '변경 성공', type: PaperResponseDto }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문' }),
  );

export const ApiDeletePaper = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '논문 삭제', description: '주저자 또는 교수/랩장만 삭제 가능' }),
    labIdParam(),
    paperIdParam(),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문' }),
  );

export const ApiAddPaperMember = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '논문 참여 멤버 추가', description: '주저자 또는 교수/랩장만 추가 가능' }),
    labIdParam(),
    paperIdParam(),
    ApiBody({ type: AddPaperMemberRequestDto }),
    ApiResponse({ status: 200, description: '추가 성공', type: PaperResponseDto }),
    ApiResponse({ status: 400, description: '이미 참여 중인 멤버' }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문 / 존재하지 않는 멤버' }),
  );

export const ApiRemovePaperMember = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '논문 참여 멤버 제거',
      description: '주저자 또는 교수/랩장만 제거 가능. 주저자는 제거 불가.',
    }),
    labIdParam(),
    paperIdParam(),
    ApiParam({ name: 'memberUserId', description: '제거할 유저 ID', type: Number }),
    ApiResponse({ status: 200, description: '제거 성공', type: PaperResponseDto }),
    ApiResponse({ status: 400, description: '주저자는 제거 불가' }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '존재하지 않는 논문 / 참여 중이지 않은 멤버' }),
  );
