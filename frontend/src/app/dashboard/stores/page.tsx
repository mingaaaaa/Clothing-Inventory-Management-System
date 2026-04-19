'use client';

import { useEffect } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreSearchBar } from '@/components/stores/store-search-bar';
import { StoreTable } from '@/components/stores/store-table';
import { StoreFormDialog } from '@/components/stores/store-form-dialog';
import { StoreDetailDrawer } from '@/components/stores/store-detail-drawer';
import { StoreDeleteDialog } from '@/components/stores/store-delete-dialog';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">门店管理</h2>
          <p className="mt-1 text-sm text-muted-foreground">管理所有门店信息</p>
        </div>
        <Button
          onClick={openCreateForm}
          className="gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增门店
        </Button>
      </div>

      {/* 搜索筛选 */}
      <StoreSearchBar />

      {/* 数据表格 */}
      <StoreTable />

      {/* 分页 */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">{total}</span> 条记录
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
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
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="icon-sm"
                  onClick={() => setPage(pageNum)}
                  className={`min-w-9 rounded-lg ${page === pageNum ? 'gradient-primary shadow-sm shadow-primary/20' : ''}`}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-28 h-8 rounded-lg text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10条/页</SelectItem>
              <SelectItem value="20">20条/页</SelectItem>
              <SelectItem value="50">50条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 对话框 */}
      <StoreFormDialog />
      <StoreDetailDrawer />
      <StoreDeleteDialog />
    </div>
  );
}
