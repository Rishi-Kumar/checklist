import type { Habit } from '../../lib/types';
import { HabitItem } from '../HabitItem/HabitItem';
import styles from './HabitList.module.css';

interface Props {
  habits: Habit[];
  date: Date;
  isComplete: (habitId: string, date: Date) => boolean;
  onToggle: (habitId: string, date: Date) => void;
}

export function HabitList({ habits, date, isComplete, onToggle }: Props) {
  if (habits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No habits yet.</p>
        <p>Tap <strong>+</strong> to add one.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitItem
            habit={habit}
            completed={isComplete(habit.id, date)}
            onToggle={() => onToggle(habit.id, date)}
          />
        </li>
      ))}
    </ul>
  );
}
