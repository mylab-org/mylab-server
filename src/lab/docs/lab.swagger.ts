import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateLabResponseDto } from '../dto/response/create-lab.response.dto.js';
import { InviteCodeResponseDto } from '../dto/response/invite-code.response.dto.js';
import { ValidateInviteCodeResponseDto } from '../dto/response/validate-invite-code.response.dto.js';
import { JoinLabResponseDto } from '../dto/response/join-lab.response.dto.js';
import { CreateInviteCodeRequestDto } from '../dto/request/create-invite-code.request.dto.js';
import { JoinLabRequestDto } from '../dto/request/join-lab.request.dto.js';
import { GetMembersResponseDto } from '../dto/response/get-members.dto.js';
import { ChangeRoleRequestDto } from '../dto/request/change-role.request.dto.js';
import { MessageResponseDto } from '../../common/dto/response/message.response.dto.js';
import { GetLabResponseDto } from '../dto/response/get-lab.response.dto.js';
import { UpdateLabRequestDto } from '../dto/request/update-lab.request.dto.js';
import { LabLinkResponseDto } from '../dto/response/lab-link.response.dto.js';
import { CreateLabLinkRequestDto } from '../dto/request/create-lab-link.request.dto.js';
import { UpdateLabLinkRequestDto } from '../dto/request/update-lab-link.request.dto.js';

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
      type: JoinLabRequestDto,
      description: '8자리 초대 코드',
    }),
    ApiResponse({ status: 201, description: '연구실 참여 성공', type: JoinLabResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 초대 코드' }),
    ApiResponse({ status: 409, description: '이미 연구실에 소속된 사용자' }),
    ApiResponse({ status: 410, description: '만료된 초대 코드 / 비활성화된 초대 코드' }),
  );
}

export function ApiGetMembers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 멤버 조회',
      description: '해당 연구실에 소속된 멤버만 조회할 수 있습니다.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 200, description: '조회 성공', type: [GetMembersResponseDto] }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiChangeRole() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '멤버 역할 변경',
      description:
        '교수는 랩장/부랩장 임명 및 해임 가능. 랩장은 부랩장 임명 및 해임 가능. 랩장 1명, 부랩장 2명 제한. 퇴소·탈퇴한 멤버는 인원 제한 집계에서 제외되며 역할 변경 대상도 될 수 없음.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiParam({ name: 'userId', description: '역할을 변경할 멤버 ID', type: Number }),
    ApiBody({ type: ChangeRoleRequestDto }),
    ApiResponse({ status: 200, description: '역할 변경 성공 (응답 본문 없음)' }),
    ApiResponse({ status: 400, description: '유효하지 않은 역할 값' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '존재하지 않는 사용자' }),
    ApiResponse({ status: 409, description: '랩장 1명 초과 / 부랩장 2명 초과' }),
  );
}

export function ApiLeaveLab() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 나가기',
      description:
        '본인이 연구실에서 나감. 작성한 게시글·댓글과 논문 참여 이력은 보존됨. 랩장/부랩장 역할은 위임되지 않음. 교수는 나갈 수 없음(회원 탈퇴 이용). 같은 연구실에 다시 가입하면 일반 멤버로 재입장.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 200, description: '나가기 성공', type: MessageResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '교수는 나갈 수 없음' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiRemoveMember() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '멤버 내보내기',
      description:
        '교수는 랩장·부랩장·멤버를, 랩장은 부랩장·멤버를 내보낼 수 있음. 부랩장·멤버는 권한 없음. 교수는 내보낼 수 없음. 본인은 내보낼 수 없음(연구실 나가기 이용). 내보낸 멤버의 게시글·댓글과 논문 참여 이력은 보존됨. 활성 초대코드는 유지되므로 재가입을 막으려면 초대코드를 폐기해야 함.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiParam({ name: 'userId', description: '내보낼 멤버의 유저 ID', type: Number }),
    ApiResponse({ status: 200, description: '내보내기 성공', type: MessageResponseDto }),
    ApiResponse({ status: 400, description: '본인을 내보내려고 함' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiGetLab() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 정보 조회',
      description:
        '연구실 이름, 소속, 교수명, 소개, 연구 분야를 조회. 해당 연구실 구성원만 조회 가능.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 200, description: '조회 성공', type: GetLabResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiUpdateLab() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 정보 수정',
      description:
        '교수 or 랩장만 가능. 보낸 필드만 수정됨. researchFields는 보낸 배열로 전체 교체됨.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiBody({ type: UpdateLabRequestDto }),
    ApiResponse({ status: 200, description: '수정 성공', type: GetLabResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiGetLabLinks() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 링크 목록 조회',
      description: '등록순으로 정렬. 해당 연구실 구성원만 조회 가능.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiResponse({ status: 200, description: '조회 성공', type: [LabLinkResponseDto] }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiCreateLabLink() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 링크 추가',
      description: '교수 or 랩장만 가능.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiBody({ type: CreateLabLinkRequestDto }),
    ApiResponse({ status: 201, description: '추가 성공', type: LabLinkResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패 (http/https 주소가 아님 등)' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자' }),
  );
}

export function ApiDeleteLabLink() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 링크 삭제',
      description: '교수 or 랩장만 가능.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiParam({ name: 'linkId', description: '링크 ID', type: Number }),
    ApiResponse({ status: 200, description: '삭제 성공', type: MessageResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 링크' }),
  );
}

export function ApiUpdateLabLink() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '연구실 링크 수정',
      description: '교수 or 랩장만 가능. 보낸 필드만 수정됨.',
    }),
    ApiParam({ name: 'labId', description: '연구실 ID', type: Number }),
    ApiParam({ name: 'linkId', description: '링크 ID', type: Number }),
    ApiBody({ type: UpdateLabLinkRequestDto }),
    ApiResponse({ status: 200, description: '수정 성공', type: LabLinkResponseDto }),
    ApiResponse({ status: 400, description: '유효성 검사 실패 (http/https 주소가 아님 등)' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 403, description: '권한 없음 (교수/랩장만 가능)' }),
    ApiResponse({ status: 404, description: '연구실에 소속되지 않은 사용자 / 존재하지 않는 링크' }),
  );
}
