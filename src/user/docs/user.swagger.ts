import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/response/user.response.dto.js';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' }),
    ApiResponse({ status: 201, description: '가입 성공', type: UserResponseDto }),
    ApiResponse({ status: 400, description: '잘못된 요청 (유효성 검사 실패)' }),
    ApiResponse({ status: 409, description: '중복된 아이디/전화번호/이메일' }),
  );
}

export function ApiGetProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '내 정보 조회', description: '로그인한 사용자의 정보를 조회합니다.' }),
    ApiResponse({ status: 200, description: '조회 성공', type: UserResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '내 정보 수정', description: '로그인한 사용자의 정보를 수정합니다.' }),
    ApiResponse({ status: 200, description: '수정 성공', type: UserResponseDto }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '비밀번호 변경', description: '비밀번호를 변경합니다.' }),
    ApiResponse({ status: 200, description: '변경 성공' }),
    ApiResponse({ status: 400, description: '현재 비밀번호 불일치' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiChangePhone() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '전화번호 변경', description: '전화번호를 변경합니다.' }),
    ApiResponse({ status: 200, description: '변경 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 409, description: '중복된 전화번호' }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '회원 탈퇴', description: '로그인한 사용자를 삭제합니다.' }),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}
