import { Badge } from '@/components/ui/badge';
import { StoreStatus, STORE_STATUS_LABELS } from '@clothing-inventory/shared';

const STATUS_STYLES: Record<StoreStatus, string> = {
  [StoreStatus.ACTIVE]: 'bg-emerald-50/80 text-emerald-600 border-emerald-100 text-[11px] px-2 py-0.5 rounded-lg font-medium',
  [StoreStatus.INACTIVE]: 'bg-gray-50/80 text-gray-500 border-gray-100 text-[11px] px-2 py-0.5 rounded-lg font-medium',
};

export function StoreStatusBadge({ status }: { status: StoreStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STORE_STATUS_LABELS[status]}
    </Badge>
  );
}
