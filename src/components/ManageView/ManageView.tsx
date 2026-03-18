import { useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Habit } from '../../lib/types';
import styles from './ManageView.module.css';

const LONG_PRESS_MS = 500;

interface SortableRowProps {
  habit: Habit;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}

function SortableRow({ habit, onDelete, onEdit }: SortableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(habit.name);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleTouchStart() {
    timerRef.current = setTimeout(() => {
      setEditValue(habit.name);
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }, LONG_PRESS_MS);
  }

  function commitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== habit.name) onEdit(habit.id, trimmed);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setIsEditing(false);
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <span
        className={styles.dragHandle}
        {...attributes}
        {...(isEditing ? {} : listeners)}
        aria-label="Drag to reorder"
      >
        ☰
      </span>

      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={styles.habitName}
          onTouchStart={handleTouchStart}
          onTouchEnd={clearTimer}
          onTouchMove={clearTimer}
        >
          {habit.name}
        </span>
      )}

      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(habit.id)}
        aria-label={`Delete ${habit.name}`}
      >
        ✕
      </button>
    </div>
  );
}

interface Props {
  habits: Habit[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onEdit: (id: string, name: string) => void;
}

export function ManageView({ habits, onClose, onDelete, onReorder, onEdit }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex((h) => h.id === active.id);
    const newIndex = habits.findIndex((h) => h.id === over.id);
    onReorder(oldIndex, newIndex);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Manage Habits</h2>
          <button className={styles.doneBtn} onClick={onClose}>
            Done
          </button>
        </div>

        {habits.length === 0 ? (
          <p className={styles.empty}>No habits yet.</p>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={habits.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.list}>
                {habits.map((habit) => (
                  <SortableRow
                    key={habit.id}
                    habit={habit}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
