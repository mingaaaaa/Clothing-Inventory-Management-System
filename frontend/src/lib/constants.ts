export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  AUTH_STATUS: 'auth_status',
} as const;
