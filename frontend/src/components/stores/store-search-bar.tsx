'use client';

import { useCallback, useRef, useState } from 'react';
import { useStoreStore } from '@/stores/store-store';
import { StoreType, StoreStatus, STORE_TYPE_LABELS, STORE_STATUS_LABELS } from '@clothing-inventory/shared';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="mb-4 p-4 rounded-2xl bg-white premium-shadow">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-55">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            type="text"
            placeholder="搜索门店名称或编码..."
            value={localKeyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-10 h-10 rounded-xl border-border/50 bg-muted/30 transition-all duration-200 focus-visible:bg-white focus-visible:border-primary/30 focus-visible:ring-primary/10"
          />
        </div>

        <Select value={filterType || undefined} onValueChange={(v) => { setFilterType(v as StoreType | ''); fetchStores(); }}>
          <SelectTrigger className="w-32 h-10 rounded-xl border-border/50">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus || undefined} onValueChange={(v) => { setFilterStatus(v as StoreStatus | ''); fetchStores(); }}>
          <SelectTrigger className="w-32 h-10 rounded-xl border-border/50">
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STORE_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="城市筛选"
          value={filterCity}
          onChange={(e) => handleCityChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
          onBlur={handleCitySearch}
          className="w-32 h-10 rounded-xl border-border/50"
        />

        <Button variant="outline" size="sm" onClick={handleReset} className="h-10 rounded-xl gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          重置
        </Button>
      </div>
    </div>
  );
}
