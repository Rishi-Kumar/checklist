import { formatDisplay, addDays } from '../../lib/dates';
import styles from './DateHeader.module.css';

interface Props {
  date: Date;
  onDateChange: (date: Date) => void;
  onManage: () => void;
  score: { done: number; total: number } | null;
}

export function DateHeader({ date, onDateChange, onManage, score }: Props) {
  const allDone = score !== null && score.done === score.total;

  return (
    <header className={styles.header}>
      <button
        className={styles.navBtn}
        onClick={() => onDateChange(addDays(date, -1))}
        aria-label="Previous day"
      >
        ‹
      </button>
      <div className={styles.center}>
        <span className={styles.dateLabel}>{formatDisplay(date)}</span>
        {score && (
          <span className={`${styles.score} ${allDone ? styles.scoreDone : ''}`}>
            {score.done}/{score.total}
          </span>
        )}
      </div>
      <button
        className={styles.navBtn}
        onClick={() => onDateChange(addDays(date, 1))}
        aria-label="Next day"
      >
        ›
      </button>
      <button
        className={styles.manageBtn}
        onClick={onManage}
        aria-label="Manage habits"
      >
        ⚙
      </button>
    </header>
  );
}
