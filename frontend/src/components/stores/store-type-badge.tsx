import { StoreType, STORE_TYPE_LABELS } from '@clothing-inventory/shared';

const TYPE_STYLES: Record<StoreType, string> = {
  [StoreType.DIRECT]: 'bg-blue-50 text-blue-600',
  [StoreType.FRANCHISE]: 'bg-purple-50 text-purple-600',
  [StoreType.WAREHOUSE]: 'bg-green-50 text-green-600',
};

export function StoreTypeBadge({ type }: { type: StoreType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[type]}`}
    >
      {STORE_TYPE_LABELS[type]}
    </span>
  );
}
