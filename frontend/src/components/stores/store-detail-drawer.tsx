'use client';

import { useStoreStore } from '@/stores/store-store';
import { STORE_TYPE_LABELS, STORE_STATUS_LABELS } from '@clothing-inventory/shared';
import { X } from 'lucide-react';

export function StoreDetailDrawer() {
  const { detailOpen, detailStore, closeDetail } = useStoreStore();

  if (!detailOpen || !detailStore) return null;

  const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="py-2">
      <span className="text-xs text-[#999]">{label}</span>
      <div className="mt-0.5 text-sm text-[#333]">{value || '-'}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={closeDetail}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/30" />
      {/* 抽屉 */}
      <div
        className="relative w-full max-w-md overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 flex items-center justify-between border-b border-[#eaeaea] bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">{detailStore.name}</h3>
          <button onClick={closeDetail} className="rounded-lg p-1 text-[#999] hover:bg-[#f0f0f0]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* 基本信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">基本信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="门店编码" value={detailStore.code} />
              <Field label="门店类型" value={STORE_TYPE_LABELS[detailStore.type]} />
              <Field label="状态" value={STORE_STATUS_LABELS[detailStore.status]} />
            </div>
          </section>

          {/* 地址信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">地址信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="国家" value={detailStore.country} />
              <Field label="省份" value={detailStore.province} />
              <Field label="城市" value={detailStore.city} />
              <Field label="区县" value={detailStore.district} />
              <Field label="详细地址" value={detailStore.address} />
              <Field label="经纬度" value={
                detailStore.longitude && detailStore.latitude
                  ? `${detailStore.longitude}, ${detailStore.latitude}`
                  : null
              } />
            </div>
          </section>

          {/* 联系信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">联系信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="联系人" value={detailStore.contactName} />
              <Field label="联系电话" value={detailStore.contactPhone} />
            </div>
          </section>

          {/* 运营信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">运营信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="营业时间" value={detailStore.openTime} />
              <Field label="开店日期" value={detailStore.openDate ? new Date(detailStore.openDate).toLocaleDateString() : null} />
              <Field label="关闭日期" value={detailStore.closeDate ? new Date(detailStore.closeDate).toLocaleDateString() : null} />
              <Field label="面积(㎡)" value={detailStore.area} />
              <Field label="员工数量" value={detailStore.employeeCount} />
            </div>
          </section>

          {/* 管理信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">管理信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="店长" value={detailStore.managerName} />
              <Field label="租金" value={detailStore.rentCost != null ? `¥${detailStore.rentCost}` : null} />
            </div>
            {detailStore.remark && (
              <Field label="备注" value={detailStore.remark} />
            )}
          </section>

          {/* 系统信息 */}
          <section>
            <h4 className="mb-2 text-sm font-semibold text-[#1a1a2e]">系统信息</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="创建时间" value={new Date(detailStore.createdAt).toLocaleString()} />
              <Field label="更新时间" value={new Date(detailStore.updatedAt).toLocaleString()} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
