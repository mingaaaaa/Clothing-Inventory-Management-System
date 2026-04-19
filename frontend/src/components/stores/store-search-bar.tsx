'use client';

import { useCallback, useRef, useState } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreType, StoreStatus, STORE_TYPE_LABELS, STORE_STATUS_LABELS } from '@clothing-inventory/shared';
import { Search, RotateCcw } from 'lucide-react';

export function StoreSearchBar() {
  const { keyword, filterType, filterStatus, filterCity, setKeyword, setFilterType, setFilterStatus, setFilterCity, fetchStores } = useStoreStore();
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleKeywordChange = useCallback(
    (value: string) => {
      setLocalKeyword(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setKeyword(value);
        fetchStores();
      }, 300);
    },
    [setKeyword, fetchStores],
  );

  const handleCityChange = useCallback(
    (value: string) => {
      setFilterCity(value);
    },
    [setFilterCity],
  );

  const handleCitySearch = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  const handleReset = useCallback(() => {
    setLocalKeyword('');
    setKeyword('');
    setFilterType('');
    setFilterStatus('');
    setFilterCity('');
    fetchStores();
  }, [setKeyword, setFilterType, setFilterStatus, setFilterCity, fetchStores]);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
        <input
          type="text"
          placeholder="搜索门店名称或编码..."
          value={localKeyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full rounded-lg border border-[#e0ddd8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
        />
      </div>

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as StoreType | '')}
        className="rounded-lg border border-[#e0ddd8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6366f1]"
      >
        <option value="">全部类型</option>
        {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as StoreStatus | '')}
        className="rounded-lg border border-[#e0ddd8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6366f1]"
      >
        <option value="">全部状态</option>
        {Object.entries(STORE_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="城市筛选"
        value={filterCity}
        onChange={(e) => handleCityChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
        onBlur={handleCitySearch}
        className="w-32 rounded-lg border border-[#e0ddd8] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10"
      />

      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-lg border border-[#e0ddd8] bg-white px-4 py-2.5 text-sm text-[#555] hover:bg-[#f5f5f5]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        重置
      </button>
    </div>
  );
}
