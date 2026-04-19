'use client';

import { useStoreStore } from '@/stores/store-store';
import { StoreTypeBadge } from './store-type-badge';
import { StoreStatusBadge } from './store-status-badge';
import { Eye, Pencil, Trash2, ArrowUpDown, Loader2 } from 'lucide-react';

export function StoreTable() {
  const { stores, loading, sortBy, sortOrder, setSort, openDetail, openEditForm, openDelete } = useStoreStore();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999] hover:text-[#333]"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortBy === field ? 'text-[#6366f1]' : ''}`} />
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#6366f1]" />
        <span className="ml-2 text-sm text-[#999]">加载中...</span>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-[#999]">暂无门店数据</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#eaeaea] bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#f0f0f0] bg-[#fafaf9]">
            <SortHeader field="code" label="编码" />
            <SortHeader field="name" label="名称" />
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">类型</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">状态</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">城市</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">地址</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">联系人</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">联系电话</th>
            <SortHeader field="area" label="面积(m²)" />
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#999]">创建时间</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-[#999]">操作</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-b border-[#f0f0f0] hover:bg-[#fafaf9]">
              <td className="px-4 py-3 text-sm font-medium text-[#1a1a2e]">{store.code}</td>
              <td className="px-4 py-3 text-sm text-[#333]">{store.name}</td>
              <td className="px-4 py-3"><StoreTypeBadge type={store.type} /></td>
              <td className="px-4 py-3"><StoreStatusBadge status={store.status} /></td>
              <td className="px-4 py-3 text-sm text-[#666]">{store.city || '-'}</td>
              <td className="max-w-[200px] truncate px-4 py-3 text-sm text-[#666]">{store.address || '-'}</td>
              <td className="px-4 py-3 text-sm text-[#666]">{store.contactName || '-'}</td>
              <td className="px-4 py-3 text-sm text-[#666]">{store.contactPhone || '-'}</td>
              <td className="px-4 py-3 text-sm text-[#666]">{store.area ?? '-'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-[#666]">
                {new Date(store.createdAt).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => openDetail(store)}
                    className="rounded-lg p-1.5 text-[#999] hover:bg-[#f0f0f0] hover:text-[#6366f1]"
                    title="查看详情"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditForm(store)}
                    className="rounded-lg p-1.5 text-[#999] hover:bg-[#f0f0f0] hover:text-[#6366f1]"
                    title="编辑"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDelete(store)}
                    className="rounded-lg p-1.5 text-[#999] hover:bg-[#f0f0f0] hover:text-red-500"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
