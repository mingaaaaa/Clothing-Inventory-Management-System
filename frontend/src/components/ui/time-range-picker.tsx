'use client';

import { Input } from '@/components/ui/input';

interface TimeRangePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const [start, end] = (value || '').split('-');

  return (
    <div className="flex items-center gap-2">
      <Input
        type="time"
        value={start || ''}
        onChange={(e) => onChange(`${e.target.value}-${end || ''}`)}
        className="flex-1"
      />
      <span className="text-muted-foreground text-sm shrink-0">至</span>
      <Input
        type="time"
        value={end || ''}
        onChange={(e) => onChange(`${start || ''}-${e.target.value}`)}
        className="flex-1"
      />
    </div>
  );
}
