import type { CookieOptions } from 'express';
import { REFRESH_TOKEN_TTL_MS } from './jwt.config.js';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

// 배포: COOKIE_DOMAIN=.mylab.com → mylab.com / api.mylab.com 공유 (OA와 동일)
// 로컬: Domain 미설정 → rewrite 시 Next(localhost:3000) Host에 쿠키 부착
const cookieDomain = process.env.COOKIE_DOMAIN?.trim() || undefined;

// localStorage에 두면 XSS 한 번에 refresh까지 털려서 httpOnly 쿠키로 옮김
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  // 로컬은 http라 secure 켜면 쿠키가 안 붙음 -> 운영에서만
  secure: process.env.NODE_ENV === 'production',
  // 서브도메인 간(same-site)이면 lax로 충분. 완전 다른 사이트면 none + secure 필요
  sameSite: 'lax',
  path: '/',
  ...(cookieDomain ? { domain: cookieDomain } : {}),
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_TTL_MS,
};

// clearCookie는 path/domain까지 같아야 지워져서 옵션 따로 둠 (maxAge만 뺌)
export const REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS: CookieOptions = baseCookieOptions;
