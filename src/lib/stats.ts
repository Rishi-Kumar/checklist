import type { Completion } from './types';
import { toYMD, addDays } from './dates';

export function getStreak(habitId: string, completions: Completion[]): number {
  const done = new Set(
    completions.filter((c) => c.habitId === habitId).map((c) => c.date)
  );

  let date = new Date();
  // If today isn't done yet, start counting from yesterday so streak doesn't
  // reset to 0 just because the user hasn't checked in yet today
  if (!done.has(toYMD(date))) {
    date = addDays(date, -1);
  }

  let streak = 0;
  while (done.has(toYMD(date))) {
    streak++;
    date = addDays(date, -1);
  }

  return streak;
}
