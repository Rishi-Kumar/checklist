import { useState, useRef, useEffect } from 'react';
import styles from './AddHabitModal.module.css';

interface Props {
  onAdd: (name: string) => void;
  onClose: () => void;
}

export function AddHabitModal({ onAdd, onClose }: Props) {
  const [value, setValue] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);

  // iOS Safari: keyboard opens against the layout viewport, not visual viewport.
  // Track visualViewport resize to push the sheet above the keyboard.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !sheetRef.current) return;

    function update() {
      if (!sheetRef.current) return;
      const keyboardHeight = window.innerHeight - vv!.offsetTop - vv!.height;
      sheetRef.current.style.marginBottom = `${Math.max(0, keyboardHeight)}px`;
    }

    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);

    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} />
        <h2 className={styles.title}>New Habit</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Habit name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={80}
            autoFocus
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!value.trim()}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
