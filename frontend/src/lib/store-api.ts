import axiosInstance from './axios';
import type {
  ApiResponse,
  StoreItem,
  CreateStoreRequest,
  UpdateStoreRequest,
  StoreQueryParams,
  PaginatedResponse,
} from '@clothing-inventory/shared';

export async function getStoresApi(
  params: StoreQueryParams,
): Promise<ApiResponse<PaginatedResponse<StoreItem>>> {
  const response = await axiosInstance.get<
    ApiResponse<PaginatedResponse<StoreItem>>
  >('/stores', { params });
  return response.data;
}

export async function getStoreApi(
  id: number,
): Promise<ApiResponse<StoreItem>> {
  const response = await axiosInstance.get<ApiResponse<StoreItem>>(
    `/stores/${id}`,
  );
  return response.data;
}

export async function createStoreApi(
  data: CreateStoreRequest,
): Promise<ApiResponse<StoreItem>> {
  const response = await axiosInstance.post<ApiResponse<StoreItem>>(
    '/stores',
    data,
  );
  return response.data;
}

export async function updateStoreApi(
  id: number,
  data: UpdateStoreRequest,
): Promise<ApiResponse<StoreItem>> {
  const response = await axiosInstance.patch<ApiResponse<StoreItem>>(
    `/stores/${id}`,
    data,
  );
  return response.data;
}

export async function deleteStoreApi(
  id: number,
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/stores/${id}`,
  );
  return response.data;
}
