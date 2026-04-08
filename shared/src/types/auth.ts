import { UserProfile } from './user';
import { MenuItem } from './menu';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
  menus: MenuItem[];
}

export interface TokenPayload {
  sub: number;
  username: string;
  role: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: UserProfile;
  menus: MenuItem[];
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}
