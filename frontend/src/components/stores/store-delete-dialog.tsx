'use client';

import { useState } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function StoreDeleteDialog() {
  const { deleteOpen, deletingStore, closeDelete, deleteStore } = useStoreStore();
  const [deleting, setDeleting] = useState(false);

  if (!deleteOpen || !deletingStore) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await deleteStore(deletingStore.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeDelete}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1a1a2e]">确认删除</h3>
            <p className="mt-1 text-sm text-[#666]">
              确定要删除门店「{deletingStore.name}」吗？此操作不可恢复。
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeDelete}
            className="rounded-lg border border-[#e0ddd8] bg-white px-4 py-2 text-sm text-[#555] hover:bg-[#f5f5f5]"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
