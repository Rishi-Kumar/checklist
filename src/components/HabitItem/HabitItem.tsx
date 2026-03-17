import type { Habit } from '../../lib/types';
import styles from './HabitItem.module.css';

interface Props {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggle: () => void;
}

export function HabitItem({ habit, completed, streak, onToggle }: Props) {
  return (
    <button
      className={`${styles.item} ${completed ? styles.completed : ''}`}
      onClick={onToggle}
      aria-pressed={completed}
    >
      <span className={styles.checkbox} aria-hidden="true">
        {completed ? '✓' : ''}
      </span>
      <span className={styles.name}>{habit.name}</span>
      {streak >= 2 && (
        <span className={styles.streak} aria-label={`${streak} day streak`}>
          🔥 {streak}
        </span>
      )}
    </button>
  );
}
