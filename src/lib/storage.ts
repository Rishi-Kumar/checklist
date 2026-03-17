import type { Habit, Completion } from './types';

const HABITS_KEY = 'habits';
const COMPLETIONS_KEY = 'completions';

function getFromStorage<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
}

function setToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // private browsing or storage full — state still updates in memory
  }
}

export const getHabits = (): Habit[] => getFromStorage<Habit>(HABITS_KEY);
export const setHabits = (habits: Habit[]): void => setToStorage(HABITS_KEY, habits);
export const getCompletions = (): Completion[] => getFromStorage<Completion>(COMPLETIONS_KEY);
export const setCompletions = (completions: Completion[]): void => setToStorage(COMPLETIONS_KEY, completions);
