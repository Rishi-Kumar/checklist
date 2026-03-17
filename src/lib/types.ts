export interface Habit {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD
}
