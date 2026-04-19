import { create } from 'zustand';
import type {
  StoreItem,
  StoreType,
  StoreStatus,
} from '@clothing-inventory/shared';
import {
  getStoresApi,
  createStoreApi,
  updateStoreApi,
  deleteStoreApi,
} from '@/lib/store-api';
import type { CreateStoreRequest, UpdateStoreRequest } from '@clothing-inventory/shared';

interface StoreState {
  // 列表数据
  stores: StoreItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;

  // 查询参数
  keyword: string;
  filterType: StoreType | '';
  filterStatus: StoreStatus | '';
  filterCity: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // 对话框状态
  formOpen: boolean;
  editingStore: StoreItem | null;
  detailOpen: boolean;
  detailStore: StoreItem | null;
  deleteOpen: boolean;
  deletingStore: StoreItem | null;

  // Actions
  fetchStores: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setKeyword: (keyword: string) => void;
  setFilterType: (type: StoreType | '') => void;
  setFilterStatus: (status: StoreStatus | '') => void;
  setFilterCity: (city: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  openCreateForm: () => void;
  openEditForm: (store: StoreItem) => void;
  closeForm: () => void;
  openDetail: (store: StoreItem) => void;
  closeDetail: () => void;
  openDelete: (store: StoreItem) => void;
  closeDelete: () => void;
  createStore: (data: CreateStoreRequest) => Promise<void>;
  updateStore: (id: number, data: UpdateStoreRequest) => Promise<void>;
  deleteStore: (id: number) => Promise<void>;
}

export const useStoreStore = create<StoreState>()((set, get) => ({
  stores: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,

  keyword: '',
  filterType: '',
  filterStatus: '',
  filterCity: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',

  formOpen: false,
  editingStore: null,
  detailOpen: false,
  detailStore: null,
  deleteOpen: false,
  deletingStore: null,

  fetchStores: async () => {
    set({ loading: true });
    try {
      const { page, pageSize, keyword, filterType, filterStatus, filterCity, sortBy, sortOrder } = get();
      const res = await getStoresApi({
        page,
        pageSize,
        keyword: keyword || undefined,
        type: filterType || undefined,
        status: filterStatus || undefined,
        city: filterCity || undefined,
        sortBy,
        sortOrder,
      });
      const data = res.data;
      set({
        stores: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
      });
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchStores();
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, page: 1 });
    get().fetchStores();
  },

  setKeyword: (keyword: string) => {
    set({ keyword });
  },

  setFilterType: (type: StoreType | '') => {
    set({ filterType: type, page: 1 });
    get().fetchStores();
  },

  setFilterStatus: (status: StoreStatus | '') => {
    set({ filterStatus: status, page: 1 });
    get().fetchStores();
  },

  setFilterCity: (city: string) => {
    set({ filterCity: city });
  },

  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => {
    set({ sortBy, sortOrder, page: 1 });
    get().fetchStores();
  },

  openCreateForm: () => set({ formOpen: true, editingStore: null }),
  openEditForm: (store: StoreItem) => set({ formOpen: true, editingStore: store }),
  closeForm: () => set({ formOpen: false, editingStore: null }),

  openDetail: (store: StoreItem) => set({ detailOpen: true, detailStore: store }),
  closeDetail: () => set({ detailOpen: false, detailStore: null }),

  openDelete: (store: StoreItem) => set({ deleteOpen: true, deletingStore: store }),
  closeDelete: () => set({ deleteOpen: false, deletingStore: null }),

  createStore: async (data: CreateStoreRequest) => {
    await createStoreApi(data);
    get().closeForm();
    get().fetchStores();
  },

  updateStore: async (id: number, data: UpdateStoreRequest) => {
    await updateStoreApi(id, data);
    get().closeForm();
    get().fetchStores();
  },

  deleteStore: async (id: number) => {
    await deleteStoreApi(id);
    get().closeDelete();
    get().fetchStores();
  },
}));
