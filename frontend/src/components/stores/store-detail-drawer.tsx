'use client';

import { useStoreStore } from '@/stores/store-store';
import { STORE_TYPE_LABELS, STORE_STATUS_LABELS } from '@clothing-inventory/shared';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StoreTypeBadge } from './store-type-badge';
import { StoreStatusBadge } from './store-status-badge';
import { MapPin, Phone, Clock, Building2, Info } from 'lucide-react';

export function StoreDetailDrawer() {
  const { detailOpen, detailStore, closeDetail } = useStoreStore();

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="space-y-0.5">
      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      <div className="text-sm">{value || <span className="text-muted-foreground/50">-</span>}</div>
    </div>
  );

  return (
    <Sheet open={detailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header with gradient accent */}
        <div className="relative">
          <div className="h-1.5 gradient-accent-bar" />
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg">{detailStore?.name}</SheetTitle>
              <div className="flex gap-2">
                {detailStore && <StoreTypeBadge type={detailStore.type} />}
                {detailStore && <StoreStatusBadge status={detailStore.status} />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-mono">{detailStore?.code}</p>
          </SheetHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* 基本信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">基本信息</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-xl p-4">
              <Field label="门店编码" value={detailStore?.code} />
              <Field label="门店类型" value={detailStore ? STORE_TYPE_LABELS[detailStore.type] : null} />
              <Field label="状态" value={detailStore ? STORE_STATUS_LABELS[detailStore.status] : null} />
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* 地址信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">地址信息</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-xl p-4">
              <Field label="国家" value={detailStore?.country} />
              <Field label="省份" value={detailStore?.province} />
              <Field label="城市" value={detailStore?.city} />
              <Field label="区县" value={detailStore?.district} />
              <div className="col-span-2">
                <Field label="详细地址" value={detailStore?.address} />
              </div>
              <Field label="经纬度" value={
                detailStore?.longitude && detailStore?.latitude
                  ? `${detailStore.longitude}, ${detailStore.latitude}`
                  : null
              } />
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* 联系信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">联系信息</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-xl p-4">
              <Field label="联系人" value={detailStore?.contactName} />
              <Field label="联系电话" value={detailStore?.contactPhone} />
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* 运营信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">运营信息</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-xl p-4">
              <Field label="营业时间" value={detailStore?.openTime} />
              <Field label="开店日期" value={detailStore?.openDate ? new Date(detailStore.openDate).toLocaleDateString() : null} />
              <Field label="关闭日期" value={detailStore?.closeDate ? new Date(detailStore.closeDate).toLocaleDateString() : null} />
              <Field label="面积(㎡)" value={detailStore?.area} />
              <Field label="员工数量" value={detailStore?.employeeCount} />
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* 管理信息 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">管理信息</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-muted/30 rounded-xl p-4">
              <Field label="店长" value={detailStore?.managerName} />
              <Field label="租金" value={detailStore?.rentCost != null ? `¥${detailStore.rentCost.toLocaleString()}` : null} />
            </div>
            {detailStore?.remark && (
              <div className="bg-muted/30 rounded-xl p-4">
                <Field label="备注" value={detailStore.remark} />
              </div>
            )}
          </section>

          <Separator className="opacity-50" />

          {/* 系统信息 */}
          <section className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div>
                <span className="uppercase tracking-wider font-medium">创建时间</span>
                <div className="mt-0.5 font-mono">{detailStore ? new Date(detailStore.createdAt).toLocaleString() : null}</div>
              </div>
              <div>
                <span className="uppercase tracking-wider font-medium">更新时间</span>
                <div className="mt-0.5 font-mono">{detailStore ? new Date(detailStore.updatedAt).toLocaleString() : null}</div>
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
