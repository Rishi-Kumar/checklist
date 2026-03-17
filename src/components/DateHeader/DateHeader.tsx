import { formatDisplay, addDays } from '../../lib/dates';
import styles from './DateHeader.module.css';

interface Props {
  date: Date;
  onDateChange: (date: Date) => void;
  onManage: () => void;
}

export function DateHeader({ date, onDateChange, onManage }: Props) {
  return (
    <header className={styles.header}>
      <button
        className={styles.navBtn}
        onClick={() => onDateChange(addDays(date, -1))}
        aria-label="Previous day"
      >
        ‹
      </button>
      <span className={styles.dateLabel}>{formatDisplay(date)}</span>
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
