'use client';

import { useEffect } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreSearchBar } from '@/components/stores/store-search-bar';
import { StoreTable } from '@/components/stores/store-table';
import { StoreFormDialog } from '@/components/stores/store-form-dialog';
import { StoreDetailDrawer } from '@/components/stores/store-detail-drawer';
import { StoreDeleteDialog } from '@/components/stores/store-delete-dialog';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoresPage() {
  const {
    total,
    page,
    pageSize,
    totalPages,
    fetchStores,
    openCreateForm,
    setPage,
    setPageSize,
  } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">门店管理</h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4338ca]"
        >
          <Plus className="h-4 w-4" />
          新增门店
        </button>
      </div>

      {/* 搜索筛选 */}
      <StoreSearchBar />

      {/* 数据表格 */}
      <StoreTable />

      {/* 分页 */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[#999]">共 {total} 条记录</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-[#e0ddd8] bg-white p-2 text-[#666] hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`min-w-[36px] rounded-lg border px-3 py-2 text-sm ${
                    page === pageNum
                      ? 'border-[#6366f1] bg-[#6366f1] text-white'
                      : 'border-[#e0ddd8] bg-white text-[#666] hover:bg-[#f5f5f5]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-[#e0ddd8] bg-white p-2 text-[#666] hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-[#e0ddd8] bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="10">10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
          </select>
        </div>
      )}

      {/* 对话框 */}
      <StoreFormDialog />
      <StoreDetailDrawer />
      <StoreDeleteDialog />
    </div>
  );
}
