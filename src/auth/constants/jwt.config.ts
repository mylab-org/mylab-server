export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
if (!JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET 환경변수를 설정해주세요');
}

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET 환경변수를 설정해주세요');
}

export const EXPIRES_IN = {
  JWT_ACCESS_TOKEN: '30m',
  JWT_REFRESH_TOKEN: '7d',
} as const;
