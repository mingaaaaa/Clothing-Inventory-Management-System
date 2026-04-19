'use client';

import { useState } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function StoreDeleteDialog() {
  const { deleteOpen, deletingStore, closeDelete, deleteStore } = useStoreStore();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!deletingStore) return;
    setDeleting(true);
    try {
      await deleteStore(deletingStore.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && closeDelete()}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 animate-[pulse_2s_ease-in-out_infinite]">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">确认删除</AlertDialogTitle>
              <AlertDialogDescription className="mt-1.5">
                确定要删除门店「<span className="font-medium text-foreground">{deletingStore?.name}</span>」吗？此操作不可恢复。
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-lg shadow-red-500/20"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
