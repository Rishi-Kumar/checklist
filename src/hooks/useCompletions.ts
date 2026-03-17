import { useState } from 'react';
import type { Completion } from '../lib/types';
import { getCompletions, setCompletions } from '../lib/storage';
import { toYMD } from '../lib/dates';

export function useCompletions() {
  const [completions, setCompletionsState] = useState<Completion[]>(() =>
    getCompletions()
  );

  function matchesEntry(habitId: string, dateStr: string) {
    return (c: Completion) => c.habitId === habitId && c.date === dateStr;
  }

  function toggleCompletion(habitId: string, date: Date) {
    const dateStr = toYMD(date);
    const matches = matchesEntry(habitId, dateStr);
    const exists = completions.some(matches);

    const updated = exists
      ? completions.filter((c) => !matches(c))
      : [...completions, { habitId, date: dateStr }];

    setCompletionsState(updated);
    setCompletions(updated);
  }

  function isComplete(habitId: string, date: Date): boolean {
    return completions.some(matchesEntry(habitId, toYMD(date)));
  }

  return { toggleCompletion, isComplete };
}
