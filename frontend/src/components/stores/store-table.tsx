'use client';

import { useStoreStore } from '@/stores/store-store';
import { StoreTypeBadge } from './store-type-badge';
import { StoreStatusBadge } from './store-status-badge';
import { Eye, Pencil, Trash2, ArrowUpDown, Loader2, PackageOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export function StoreTable() {
  const { stores, loading, sortBy, sortOrder, setSort, openDetail, openEditForm, openDelete } = useStoreStore();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white premium-shadow">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="mt-3 text-sm text-muted-foreground">加载中...</span>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white premium-shadow">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <PackageOpen className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">暂无门店数据</p>
        <p className="text-xs text-muted-foreground/60 mt-1">点击上方按钮新增门店</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white premium-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
            <TableHead
              className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wider text-muted-foreground"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center gap-1">
                编码
                <ArrowUpDown className={`h-3 w-3 transition-colors ${sortBy === 'code' ? 'text-primary' : 'text-muted-foreground/40'}`} />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              名称
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">类型</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">状态</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">城市</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">地址</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">联系人</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">联系电话</TableHead>
            <TableHead
              className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wider text-muted-foreground"
              onClick={() => handleSort('area')}
            >
              <div className="flex items-center gap-1">
                面积(m²)
                <ArrowUpDown className={`h-3 w-3 transition-colors ${sortBy === 'area' ? 'text-primary' : 'text-muted-foreground/40'}`} />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">创建时间</TableHead>
            <TableHead className="text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow
              key={store.id}
              className="border-border/30 transition-colors duration-150 hover:bg-primary/2"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <TableCell className="font-semibold text-xs">{store.code}</TableCell>
              <TableCell className="font-medium">{store.name}</TableCell>
              <TableCell><StoreTypeBadge type={store.type} /></TableCell>
              <TableCell><StoreStatusBadge status={store.status} /></TableCell>
              <TableCell>{store.city || '-'}</TableCell>
              <TableCell className="max-w-40 truncate text-muted-foreground">{store.address || '-'}</TableCell>
              <TableCell>{store.contactName || '-'}</TableCell>
              <TableCell className="text-muted-foreground">{store.contactPhone || '-'}</TableCell>
              <TableCell>{store.area ?? '-'}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                {new Date(store.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-0.5">
                  <Button variant="ghost" size="icon-sm" onClick={() => openDetail(store)} title="查看详情" className="rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEditForm(store)} title="编辑" className="rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => openDelete(store)} title="删除" className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
