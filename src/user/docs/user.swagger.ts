import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/response/user.response.dto.js';
import { MessageResponseDto } from '../../common/dto/response/message.response.dto.js';
import { WithdrawUserRequestDto } from '../dto/request/withdraw-user.request.dto.js';

export function ApiGetProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '내 정보 조회' }),
    ApiResponse({ status: 200, description: '조회 성공', type: UserResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '내 정보 수정' }),
    ApiResponse({ status: 200, description: '수정 성공', type: UserResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiWithdrawUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '회원 탈퇴',
      description:
        '현재 비밀번호 재확인이 필요하며 복구할 수 없음. 작성한 게시글·댓글은 보존되고 작성자만 "탈퇴한 사용자"로 표시됨. 소속 연구실에서는 퇴소 처리되며 랩장/부랩장 역할은 위임되지 않음(교수가 다시 임명해야 함). 교수는 본인이 개설한 연구실에 다른 활동 멤버가 없을 때만 탈퇴 가능하며, 이때 해당 연구실은 폐쇄되고 활성 초대코드도 함께 비활성화됨. 탈퇴 후 같은 이메일로 재가입 가능.',
    }),
    ApiBody({ type: WithdrawUserRequestDto }),
    ApiResponse({ status: 200, description: '탈퇴 성공', type: MessageResponseDto }),
    ApiResponse({ status: 400, description: '비밀번호 불일치' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 사용자' }),
    ApiResponse({ status: 409, description: '개설한 연구실에 다른 멤버가 남아있음' }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '비밀번호 변경' }),
    ApiResponse({ status: 200, description: '변경 성공', type: MessageResponseDto }),
    ApiResponse({ status: 400, description: '현재 비밀번호 불일치' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 404, description: '존재하지 않는 사용자' }),
  );
}
