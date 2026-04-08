import axiosInstance from './axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '@clothing-inventory/shared';

export async function loginApi(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data;
}

export async function refreshTokenApi(): Promise<ApiResponse<LoginResponse>> {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/refresh');
  return response.data;
}

export async function logoutApi(): Promise<ApiResponse> {
  const response = await axiosInstance.post<ApiResponse>('/auth/logout');
  return response.data;
}

export async function getProfileApi(): Promise<ApiResponse> {
  const response = await axiosInstance.get<ApiResponse>('/auth/profile');
  return response.data;
}
