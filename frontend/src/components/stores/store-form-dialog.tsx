'use client';

import { useState, useEffect } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreType, StoreStatus, STORE_TYPE_LABELS, STORE_STATUS_LABELS, type StoreItem } from '@clothing-inventory/shared';
import { X, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  code: string;
  type: StoreType;
  status: StoreStatus;
  country: string;
  province: string;
  city: string;
  district: string;
  address: string;
  longitude: string;
  latitude: string;
  contactName: string;
  contactPhone: string;
  openTime: string;
  openDate: string;
  closeDate: string;
  area: string;
  employeeCount: string;
  managerName: string;
  remark: string;
  rentCost: string;
}

const initialFormData: FormData = {
  name: '',
  code: '',
  type: StoreType.DIRECT,
  status: StoreStatus.ACTIVE,
  country: '',
  province: '',
  city: '',
  district: '',
  address: '',
  longitude: '',
  latitude: '',
  contactName: '',
  contactPhone: '',
  openTime: '',
  openDate: '',
  closeDate: '',
  area: '',
  employeeCount: '',
  managerName: '',
  remark: '',
  rentCost: '',
};

function storeToFormData(store: StoreItem): FormData {
  return {
    name: store.name,
    code: store.code,
    type: store.type,
    status: store.status,
    country: store.country || '',
    province: store.province || '',
    city: store.city || '',
    district: store.district || '',
    address: store.address || '',
    longitude: store.longitude?.toString() || '',
    latitude: store.latitude?.toString() || '',
    contactName: store.contactName || '',
    contactPhone: store.contactPhone || '',
    openTime: store.openTime || '',
    openDate: store.openDate ? store.openDate.split('T')[0] : '',
    closeDate: store.closeDate ? store.closeDate.split('T')[0] : '',
    area: store.area?.toString() || '',
    employeeCount: store.employeeCount?.toString() || '',
    managerName: store.managerName || '',
    remark: store.remark || '',
    rentCost: store.rentCost?.toString() || '',
  };
}

export function StoreFormDialog() {
  const { formOpen, editingStore, closeForm, createStore, updateStore } = useStoreStore();
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!editingStore;

  useEffect(() => {
    if (formOpen) {
      setForm(editingStore ? storeToFormData(editingStore) : initialFormData);
      setErrors({});
    }
  }, [formOpen, editingStore]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = '请输入门店名称';
    if (!form.code.trim()) newErrors.code = '请输入门店编码';
    if (!form.province.trim()) newErrors.province = '请输入省份';
    if (!form.city.trim()) newErrors.city = '请输入城市';
    if (!form.district.trim()) newErrors.district = '请输入区县';
    if (!form.address.trim()) newErrors.address = '请输入详细地址';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        type: form.type as StoreType,
        status: form.status as StoreStatus,
        country: form.country.trim() || undefined,
        province: form.province.trim(),
        city: form.city.trim(),
        district: form.district.trim(),
        address: form.address.trim(),
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        contactName: form.contactName.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        openTime: form.openTime.trim() || undefined,
        openDate: form.openDate || undefined,
        closeDate: form.closeDate || undefined,
        area: form.area ? parseFloat(form.area) : undefined,
        employeeCount: form.employeeCount ? parseInt(form.employeeCount, 10) : undefined,
        managerName: form.managerName.trim() || undefined,
        remark: form.remark.trim() || undefined,
        rentCost: form.rentCost ? parseFloat(form.rentCost) : undefined,
      };

      if (isEdit && editingStore) {
        await updateStore(editingStore.id, payload);
      } else {
        await createStore(payload);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!formOpen) return null;

  const inputCls =
    'w-full rounded-lg border border-[#e0ddd8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10';
  const labelCls = 'mb-1.5 block text-sm font-medium text-[#333]';
  const errorCls = 'mt-1 text-xs text-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeForm}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">
            {isEdit ? '编辑门店' : '新增门店'}
          </h3>
          <button onClick={closeForm} className="rounded-lg p-1 text-[#999] hover:bg-[#f0f0f0]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 基本信息 */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-[#1a1a2e]">基本信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>门店名称 *</label>
              <input className={inputCls} value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              {errors.name && <p className={errorCls}>{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>门店编码 *</label>
              <input className={inputCls} value={form.code} onChange={(e) => updateField('code', e.target.value)} disabled={isEdit} />
              {errors.code && <p className={errorCls}>{errors.code}</p>}
            </div>
            <div>
              <label className={labelCls}>门店类型</label>
              <select className={inputCls} value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>状态</label>
              <select className={inputCls} value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                {Object.entries(STORE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 地址信息 */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-[#1a1a2e]">地址信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>省份 *</label>
              <input className={inputCls} value={form.province} onChange={(e) => updateField('province', e.target.value)} />
              {errors.province && <p className={errorCls}>{errors.province}</p>}
            </div>
            <div>
              <label className={labelCls}>城市 *</label>
              <input className={inputCls} value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              {errors.city && <p className={errorCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>区县 *</label>
              <input className={inputCls} value={form.district} onChange={(e) => updateField('district', e.target.value)} />
              {errors.district && <p className={errorCls}>{errors.district}</p>}
            </div>
            <div>
              <label className={labelCls}>国家</label>
              <input className={inputCls} value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>详细地址 *</label>
              <input className={inputCls} value={form.address} onChange={(e) => updateField('address', e.target.value)} />
              {errors.address && <p className={errorCls}>{errors.address}</p>}
            </div>
            <div>
              <label className={labelCls}>经度</label>
              <input type="number" step="any" className={inputCls} value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>纬度</label>
              <input type="number" step="any" className={inputCls} value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-[#1a1a2e]">联系信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>联系人</label>
              <input className={inputCls} value={form.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>联系电话</label>
              <input className={inputCls} value={form.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 运营信息 */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-[#1a1a2e]">运营信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>营业时间</label>
              <input className={inputCls} placeholder="例如 09:00-22:00" value={form.openTime} onChange={(e) => updateField('openTime', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>开店日期</label>
              <input type="date" className={inputCls} value={form.openDate} onChange={(e) => updateField('openDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>关闭日期</label>
              <input type="date" className={inputCls} value={form.closeDate} onChange={(e) => updateField('closeDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>面积(㎡)</label>
              <input type="number" step="any" className={inputCls} value={form.area} onChange={(e) => updateField('area', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>员工数量</label>
              <input type="number" className={inputCls} value={form.employeeCount} onChange={(e) => updateField('employeeCount', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 管理信息 */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-semibold text-[#1a1a2e]">管理信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>店长姓名</label>
              <input className={inputCls} value={form.managerName} onChange={(e) => updateField('managerName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>租金</label>
              <input type="number" step="any" className={inputCls} value={form.rentCost} onChange={(e) => updateField('rentCost', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>备注</label>
              <textarea className={`${inputCls} min-h-[80px] resize-y`} value={form.remark} onChange={(e) => updateField('remark', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeForm}
            className="rounded-lg border border-[#e0ddd8] bg-white px-4 py-2 text-sm text-[#555] hover:bg-[#f5f5f5]"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4338ca] disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? '保存' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
}
