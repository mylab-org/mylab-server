import type { CookieOptions } from 'express';
import { REFRESH_TOKEN_TTL_MS } from './jwt.config.js';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

// localStorage에 두면 XSS 한 번에 refresh까지 털려서 httpOnly 쿠키로 옮김
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  // 로컬은 http라 secure 켜면 쿠키가 안 붙음 -> 운영에서만
  secure: process.env.NODE_ENV === 'production',
  // TODO: 배포 때 프론트/서버 도메인이 아예 다르면 'none' + secure 필요 (그럼 CSRF도 다시 봐야 함)
  sameSite: 'lax',
  // refresh는 /auth 쪽에서만 쓰니까 다른 API 요청엔 안 실리게 범위 좁힘
  path: '/api/auth',
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_TTL_MS,
};

// clearCookie는 path까지 같아야 지워져서 옵션 따로 둠 (maxAge만 뺌)
export const REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS: CookieOptions = baseCookieOptions;
