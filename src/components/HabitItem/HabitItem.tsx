import type { Habit } from '../../lib/types';
import styles from './HabitItem.module.css';

interface Props {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
}

export function HabitItem({ habit, completed, onToggle }: Props) {
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
    </button>
  );
}
