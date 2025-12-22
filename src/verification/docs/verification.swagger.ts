import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiSendEmailVerification() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '교수 이메일 인증 발송' }),
    ApiResponse({ status: 200, description: '인증 메일 발송 성공' }),
    ApiResponse({ status: 400, description: '교수가 아님 / 이미 인증됨' }),
    ApiResponse({ status: 401, description: '인증 실패' }),
    ApiResponse({ status: 429, description: '재발송 대기 중 (60초)' }),
  );
}

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: '이메일 인증 처리' }),
    ApiQuery({ name: 'token', description: '인증 토큰', required: true }),
    ApiResponse({ status: 200, description: '인증 성공' }),
    ApiResponse({ status: 400, description: '유효하지 않은 토큰 / 만료된 토큰' }),
  );
}
