import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TokenResponseDto } from '../dto/response/token.response.dto.js';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: '로그인', description: 'Access Token과 Refresh Token을 발급합니다' }),
    ApiResponse({ status: 200, description: '로그인 성공', type: TokenResponseDto }),
    ApiResponse({ status: 400, description: '아이디/전화번호 또는 비밀번호 누락' }),
    ApiResponse({ status: 401, description: '아이디 또는 비밀번호 불일치' }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '로그아웃', description: 'Refresh Token을 무효화합니다' }),
    ApiResponse({ status: 200, description: '로그아웃 성공' }),
    ApiResponse({ status: 401, description: 'Access Token 없음 또는 만료' }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '토큰 재발급', description: '새로운 Access Token을 발급합니다' }),
    ApiResponse({ status: 200, description: '재발급 성공' }),
    ApiResponse({ status: 401, description: 'Refresh Token 없음, 만료 또는 불일치' }),
  );
}
