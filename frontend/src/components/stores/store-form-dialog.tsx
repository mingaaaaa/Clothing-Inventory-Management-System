'use client';

import { useState, useEffect } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreType, StoreStatus, STORE_TYPE_LABELS, STORE_STATUS_LABELS, type StoreItem } from '@clothing-inventory/shared';
import { Loader2, Info, MapPin, Phone, Clock, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRangePicker } from '@/components/ui/time-range-picker';

interface FormData {
  name: string;
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

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
    </div>
  );
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

  return (
    <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
        {/* Header accent */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-accent-bar rounded-t-2xl" />
        <DialogHeader className="pt-2">
          <DialogTitle className="text-lg">{isEdit ? '编辑门店' : '新增门店'}</DialogTitle>
        </DialogHeader>

        {/* 基本信息 */}
        <div className="rounded-xl bg-muted/20 p-4">
          <SectionHeader icon={Info} title="基本信息" />
          <div className="grid grid-cols-3 gap-3">
            {isEdit && editingStore && (
              <div>
                <Label className="text-xs">门店编码</Label>
                <div className="mt-1 text-sm font-mono font-medium text-muted-foreground bg-muted/60 rounded-lg px-3 py-2">
                  {editingStore.code}
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs">门店名称 *</Label>
              <Input className="mt-1 rounded-lg" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label className="text-xs">门店类型</Label>
              <Select value={form.type} onValueChange={(v) => updateField('type', v)}>
                <SelectTrigger className="mt-1 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">状态</Label>
              <Select value={form.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger className="mt-1 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STORE_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 地址信息 */}
        <div className="rounded-xl bg-muted/20 p-4">
          <SectionHeader icon={MapPin} title="地址信息" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">省份 *</Label>
              <Input className="mt-1 rounded-lg" value={form.province} onChange={(e) => updateField('province', e.target.value)} />
              {errors.province && <p className="mt-1 text-xs text-destructive">{errors.province}</p>}
            </div>
            <div>
              <Label className="text-xs">城市 *</Label>
              <Input className="mt-1 rounded-lg" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
              {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
            </div>
            <div>
              <Label className="text-xs">区县 *</Label>
              <Input className="mt-1 rounded-lg" value={form.district} onChange={(e) => updateField('district', e.target.value)} />
              {errors.district && <p className="mt-1 text-xs text-destructive">{errors.district}</p>}
            </div>
            <div>
              <Label className="text-xs">国家</Label>
              <Input className="mt-1 rounded-lg" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">详细地址 *</Label>
              <Input className="mt-1 rounded-lg" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
              {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
            </div>
            <div>
              <Label className="text-xs">经度</Label>
              <Input type="number" step="any" className="mt-1 rounded-lg" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">纬度</Label>
              <Input type="number" step="any" className="mt-1 rounded-lg" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="rounded-xl bg-muted/20 p-4">
          <SectionHeader icon={Phone} title="联系信息" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">联系人</Label>
              <Input className="mt-1 rounded-lg" value={form.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">联系电话</Label>
              <Input className="mt-1 rounded-lg" value={form.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 运营信息 */}
        <div className="rounded-xl bg-muted/20 p-4">
          <SectionHeader icon={Clock} title="运营信息" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">营业时间</Label>
              <div className="mt-1">
                <TimeRangePicker value={form.openTime} onChange={(v) => updateField('openTime', v)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">开店日期</Label>
              <Input type="date" className="mt-1 rounded-lg" value={form.openDate} onChange={(e) => updateField('openDate', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">关闭日期</Label>
              <Input type="date" className="mt-1 rounded-lg" value={form.closeDate} onChange={(e) => updateField('closeDate', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">面积(㎡)</Label>
              <Input type="number" step="any" className="mt-1 rounded-lg" value={form.area} onChange={(e) => updateField('area', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">员工数量</Label>
              <Input type="number" className="mt-1 rounded-lg" value={form.employeeCount} onChange={(e) => updateField('employeeCount', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 管理信息 */}
        <div className="rounded-xl bg-muted/20 p-4">
          <SectionHeader icon={Building2} title="管理信息" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">店长姓名</Label>
              <Input className="mt-1 rounded-lg" value={form.managerName} onChange={(e) => updateField('managerName', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">租金</Label>
              <Input type="number" step="any" className="mt-1 rounded-lg" value={form.rentCost} onChange={(e) => updateField('rentCost', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">备注</Label>
              <Textarea className="mt-1 min-h-9.5 resize-y rounded-lg" value={form.remark} onChange={(e) => updateField('remark', e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={closeForm} className="rounded-xl">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gradient-primary text-white shadow-lg shadow-primary/20 rounded-xl"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
