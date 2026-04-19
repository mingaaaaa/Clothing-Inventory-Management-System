/** 门店类型 */
export enum StoreType {
  DIRECT = 'DIRECT',
  FRANCHISE = 'FRANCHISE',
  WAREHOUSE = 'WAREHOUSE',
}

/** 门店状态 */
export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/** 门店类型标签映射 */
export const STORE_TYPE_LABELS: Record<StoreType, string> = {
  [StoreType.DIRECT]: '直营',
  [StoreType.FRANCHISE]: '加盟',
  [StoreType.WAREHOUSE]: '仓库',
};

/** 门店状态标签映射 */
export const STORE_STATUS_LABELS: Record<StoreStatus, string> = {
  [StoreStatus.ACTIVE]: '启用',
  [StoreStatus.INACTIVE]: '停用',
};

/** 门店完整信息（API 返回） */
export interface StoreItem {
  id: number;
  name: string;
  code: string;
  type: StoreType;
  status: StoreStatus;
  country: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
  contactName: string | null;
  contactPhone: string | null;
  openTime: string | null;
  openDate: string | null;
  closeDate: string | null;
  area: number | null;
  employeeCount: number | null;
  managerId: number | null;
  managerName: string | null;
  remark: string | null;
  rentCost: number | null;
  createdAt: string;
  updatedAt: string;
}

/** 创建门店请求 */
export interface CreateStoreRequest {
  name: string;
  code?: string;
  type: StoreType;
  status?: StoreStatus;
  country?: string;
  province: string;
  city: string;
  district: string;
  address: string;
  longitude?: number;
  latitude?: number;
  contactName?: string;
  contactPhone?: string;
  openTime?: string;
  openDate?: string;
  closeDate?: string;
  area?: number;
  employeeCount?: number;
  managerId?: number;
  managerName?: string;
  remark?: string;
  rentCost?: number;
}

/** 更新门店请求 */
export type UpdateStoreRequest = Partial<CreateStoreRequest>;

/** 门店列表查询参数 */
export interface StoreQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: StoreType;
  status?: StoreStatus;
  city?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** 分页响应结构 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
