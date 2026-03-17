import type { Habit, Completion } from './types';

const HABITS_KEY = 'habits';
const COMPLETIONS_KEY = 'completions';

export function getHabits(): Habit[] {
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function setHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch {
    // private browsing or storage full — state still updates in memory
  }
}

export function getCompletions(): Completion[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function setCompletions(completions: Completion[]): void {
  try {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  } catch {
    // private browsing or storage full — state still updates in memory
  }
}
