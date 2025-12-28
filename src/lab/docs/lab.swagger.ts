import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateLabResponseDto } from '../dto/response/create-lab.response.dto.js';
import { InviteCodeResponseDto } from '../dto/response/invite-code.response.dto.js';
import { ValidateInviteCodeResponseDto } from '../dto/response/validate-invite-code.response.dto.js';
import { JoinLabResponseDto } from '../dto/response/join-lab.response.dto.js';
import { CreateInviteCodeRequestDto } from '../dto/request/create-invite-code.request.dto.js';

export function ApiCreateLab() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 생성',
    }),
    ApiResponse({ status: 201, description: '연구실 생성 성공', type: CreateLabResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '인증되지 않은 교수 / 인증 대기중인 교수' }),
    ApiResponse({ status: 404, description: '존재하지 않는 사용자' }),
    ApiResponse({ status: 409, description: '이미 연구실에 소속된 사용자' }),
  );
}

export function ApiCreateInviteCode() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '초대 코드 생성',
      description:
        '교수 or 랩장 연구실 초대 코드를 생성. 신규 코드 생성 시 기존 활성 코드는 비활성화.',
    }),
    ApiBody({
      type: CreateInviteCodeRequestDto,
      description: '만료일 미지정 시 24시간 후 자동 만료',
      required: false,
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 201, description: '초대 코드 생성 성공', type: InviteCodeResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '존재하지 않는 연구실' }),
    ApiResponse({
      status: 409,
      description:
        '초대 코드 생성 실패 (연속 생성 코드가 10번 연속 중복 <-- 이거 나오면 걍 복권 사야됨)',
    }),
  );
}

export function ApiRevokeInviteCode() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '초대 코드 비활성화',
      description: '교수 or 랩장 연구실 초대 코드를 비활성화.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiParam({ name: 'code', description: '초대 코드 (8자리)', type: String }),
    ApiResponse({ status: 204, description: '비활성화 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '존재하지 않는 초대 코드' }),
  );
}

export function ApiValidateInviteCode() {
  return applyDecorators(
    ApiOperation({
      summary: '초대 코드 검증',
      description:
        '초대 코드의 유효성을 검증하고 연구실 정보를 반환. (이용자가 초대코드를 입력했을 때 이 연구실에 참여하는게 맞는지 확인하는 용도.)',
    }),
    ApiParam({ name: 'code', description: '초대 코드 (8자리)', type: String }),
    ApiResponse({ status: 200, description: '검증 성공', type: ValidateInviteCodeResponseDto }),
    ApiResponse({ status: 404, description: '존재하지 않는 초대 코드' }),
    ApiResponse({ status: 410, description: '만료된 초대 코드 / 비활성화된 초대 코드' }),
  );
}

export function ApiJoinLab() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 참여',
    }),
    ApiBody({
      type: JoinLabResponseDto,
      description: '8자리 초대 코드',
    }),
    ApiResponse({ status: 201, description: '연구실 참여 성공', type: JoinLabResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 초대 코드' }),
    ApiResponse({ status: 409, description: '이미 연구실에 소속된 사용자' }),
    ApiResponse({ status: 410, description: '만료된 초대 코드 / 비활성화된 초대 코드' }),
  );
}
