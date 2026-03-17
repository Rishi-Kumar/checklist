import { useState } from 'react';
import type { Completion } from '../lib/types';
import { getCompletions, setCompletions } from '../lib/storage';
import { toYMD } from '../lib/dates';

export function useCompletions() {
  const [completions, setCompletionsState] = useState<Completion[]>(() =>
    getCompletions()
  );

  function toggleCompletion(habitId: string, date: Date) {
    const dateStr = toYMD(date);
    const exists = completions.some(
      (c) => c.habitId === habitId && c.date === dateStr
    );

    let updated: Completion[];
    if (exists) {
      updated = completions.filter(
        (c) => !(c.habitId === habitId && c.date === dateStr)
      );
    } else {
      updated = [...completions, { habitId, date: dateStr }];
    }

    setCompletionsState(updated);
    setCompletions(updated);
  }

  function isComplete(habitId: string, date: Date): boolean {
    const dateStr = toYMD(date);
    return completions.some((c) => c.habitId === habitId && c.date === dateStr);
  }

  return { toggleCompletion, isComplete };
}
