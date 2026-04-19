import axios from 'axios';
import { API_BASE_URL } from './constants';
import { useAuthStore } from '@/stores/auth-store';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 with token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // !originalRequest._retry:这是一个自定义标记，防止死循环。如果重试后的请求依然失败（例如 Refresh Token 也过期了），
    // 由于 _retry 已被设为 true，代码不会再进入这个刷新逻辑，而是直接抛出错误。
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 假设页面同时发起了 3 个 API 请求，它们的 Access Token 都刚好过期。
      // 如果没有这个机制，这 3 个请求会同时触发刷新 Token 的操作
      // 导致后端收到 3 次刷新请求，产生冗余甚至冲突。
      // isRefreshing 标志位确保同一时间只有一个刷新操作在进行。
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          // 后续到来的 401 请求会被放入 failedQueue 队列中等待（挂起 Promise）。
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest)); // 一旦第一个请求刷新成功，队列中的所有请求会被释放并重新发送。
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const { accessToken, user, menus } = response.data.data;
        useAuthStore.getState().setAuth({ accessToken, user, menus });

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearAuth();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
