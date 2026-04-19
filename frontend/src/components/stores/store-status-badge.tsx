import { StoreStatus, STORE_STATUS_LABELS } from '@clothing-inventory/shared';

const STATUS_STYLES: Record<StoreStatus, string> = {
  [StoreStatus.ACTIVE]: 'bg-emerald-50 text-emerald-600',
  [StoreStatus.INACTIVE]: 'bg-gray-100 text-gray-500',
};

export function StoreStatusBadge({ status }: { status: StoreStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STORE_STATUS_LABELS[status]}
    </span>
  );
}
