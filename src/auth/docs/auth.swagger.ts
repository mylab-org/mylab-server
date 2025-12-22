import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: '회원가입' }),
    ApiResponse({ status: 201, description: '가입 성공' }),
    ApiResponse({ status: 400, description: '잘못된 요청' }),
    ApiResponse({ status: 409, description: '중복된 아이디/전화번호' }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: '로그인' }),
    ApiResponse({ status: 200, description: '로그인 성공' }),
    ApiResponse({ status: 400, description: '아이디/전화번호 누락' }),
    ApiResponse({ status: 401, description: '아이디 또는 비밀번호 불일치' }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '로그아웃' }),
    ApiResponse({ status: 200, description: '로그아웃 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '토큰 재발급' }),
    ApiResponse({ status: 200, description: '재발급 성공' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
  );
}
