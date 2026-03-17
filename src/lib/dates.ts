export function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplay(date: Date): string {
  const now = new Date();
  const dateStr = toYMD(date);

  if (dateStr === toYMD(now)) return 'Today';
  if (dateStr === toYMD(addDays(now, -1))) return 'Yesterday';
  if (dateStr === toYMD(addDays(now, 1))) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
