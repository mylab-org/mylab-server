import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: '회원가입',
      description: '새로운 사용자를 등록하고 인증 메일을 발송합니다.',
    }),
    ApiResponse({ status: 201, description: '회원가입 성공 (인증 메일 발송됨)' }),
    ApiResponse({ status: 400, description: '잘못된 입력 (유효성 검사 실패)' }),
    ApiResponse({ status: 409, description: '이미 사용 중인 이메일' }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: '로그인',
      description: '이메일과 비밀번호로 로그인하여 토큰을 발급받습니다.',
    }),
    ApiResponse({ status: 200, description: '로그인 성공 (Access/Refresh Token 발급)' }),
    ApiResponse({ status: 400, description: '이메일 또는 비밀번호 누락' }),
    ApiResponse({ status: 401, description: '비밀번호 불일치 또는 존재하지 않는 계정' }),
    ApiResponse({ status: 403, description: '이메일 인증이 완료되지 않음' }),
  );
}

export function ApiResendVerification() {
  return applyDecorators(
    ApiOperation({
      summary: '인증 메일 재발송',
      description: '이메일 인증 토큰을 재발급하고 메일을 다시 전송합니다.',
    }),
    ApiResponse({ status: 200, description: '재발송 성공' }),
    ApiResponse({ status: 400, description: '이미 인증이 완료된 사용자' }),
    ApiResponse({ status: 404, description: '해당 이메일의 사용자를 찾을 수 없음' }),
  );
}

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({
      summary: '이메일 인증 확인',
      description: '메일로 전송된 토큰을 검증하여 계정을 활성화합니다.',
    }),
    ApiQuery({
      name: 'token',
      description: '이메일로 수신한 인증 토큰',
      required: true,
      type: String,
    }),
    ApiResponse({ status: 200, description: '이메일 인증 성공' }),
    ApiResponse({ status: 400, description: '유효하지 않거나 만료된 토큰' }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: '로그아웃', description: '서버에서 Refresh Token을 파기합니다.' }),
    ApiResponse({ status: 200, description: '로그아웃 성공' }),
    ApiResponse({ status: 401, description: '인증되지 않은 사용자 (토큰 없음/만료)' }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: '토큰 재발급',
      description: 'Refresh Token을 이용하여 새로운 Access Token을 발급받습니다.',
    }),
    ApiResponse({ status: 200, description: '토큰 재발급 성공' }),
    ApiResponse({ status: 401, description: '유효하지 않거나 만료된 Refresh Token' }),
  );
}
