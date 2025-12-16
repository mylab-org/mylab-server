import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
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
    ApiOperation({ summary: '프로필 조회', description: '사용자 정보를 조회합니다.' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({ status: 200, description: '조회 성공', type: UserResponseDto }),
    ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' }),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiOperation({ summary: '프로필 수정', description: '사용자 정보를 수정합니다.' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({ status: 200, description: '수정 성공', type: UserResponseDto }),
    ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: '비밀번호 변경', description: '비밀번호를 변경합니다.' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({ status: 200, description: '변경 성공' }),
    ApiResponse({ status: 400, description: '현재 비밀번호 불일치' }),
    ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' }),
  );
}

export function ApiChangePhone() {
  return applyDecorators(
    ApiOperation({ summary: '전화번호 변경', description: '전화번호를 변경합니다.' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({ status: 200, description: '변경 성공' }),
    ApiResponse({ status: 409, description: '중복된 전화번호' }),
    ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: '회원 탈퇴', description: '사용자를 삭제합니다.' }),
    ApiParam({ name: 'id', description: '사용자 ID' }),
    ApiResponse({ status: 200, description: '삭제 성공' }),
    ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' }),
  );
}
