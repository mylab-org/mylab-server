import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/response/user.response.dto.js';

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

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '회원 탈퇴' }),
    ApiResponse({ status: 200, description: '탈퇴 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '비밀번호 변경' }),
    ApiResponse({ status: 200, description: '변경 성공' }),
    ApiResponse({ status: 400, description: '현재 비밀번호 불일치' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}
