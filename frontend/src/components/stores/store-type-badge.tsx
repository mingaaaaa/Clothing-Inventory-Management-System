import { Badge } from '@/components/ui/badge';
import { StoreType, STORE_TYPE_LABELS } from '@clothing-inventory/shared';

const TYPE_STYLES: Record<StoreType, string> = {
  [StoreType.DIRECT]: 'bg-blue-50/80 text-blue-600 border-blue-100 text-[11px] px-2 py-0.5 rounded-lg font-medium',
  [StoreType.FRANCHISE]: 'bg-violet-50/80 text-violet-600 border-violet-100 text-[11px] px-2 py-0.5 rounded-lg font-medium',
  [StoreType.WAREHOUSE]: 'bg-emerald-50/80 text-emerald-600 border-emerald-100 text-[11px] px-2 py-0.5 rounded-lg font-medium',
};

export function StoreTypeBadge({ type }: { type: StoreType }) {
  return (
    <Badge variant="outline" className={TYPE_STYLES[type]}>
      {STORE_TYPE_LABELS[type]}
    </Badge>
  );
}
