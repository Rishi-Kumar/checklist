import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { Habit } from '../lib/types';
import { getHabits, setHabits, getCompletions, setCompletions } from '../lib/storage';

export function useHabits() {
  const [habits, setHabitsState] = useState<Habit[]>(() =>
    getHabits().sort((a, b) => a.order - b.order)
  );

  function addHabit(name: string) {
    const newHabit: Habit = {
      id: typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      order: habits.length,
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, newHabit];
    setHabitsState(updated);
    setHabits(updated);
  }

  function deleteHabit(id: string) {
    const updated = habits
      .filter((h) => h.id !== id)
      .map((h, i) => ({ ...h, order: i }));
    setHabitsState(updated);
    setHabits(updated);

    const completions = getCompletions().filter((c) => c.habitId !== id);
    setCompletions(completions);
  }

  function editHabit(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const updated = habits.map((h) => h.id === id ? { ...h, name: trimmed } : h);
    setHabitsState(updated);
    setHabits(updated);
  }

  function reorderHabits(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return;
    const reordered = arrayMove(habits, oldIndex, newIndex).map((h, i) => ({
      ...h,
      order: i,
    }));
    setHabitsState(reordered);
    setHabits(reordered);
  }

  return { habits, addHabit, deleteHabit, reorderHabits, editHabit };
}
