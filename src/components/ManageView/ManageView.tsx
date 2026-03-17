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

interface SortableRowProps {
  habit: Habit;
  onDelete: (id: string) => void;
}

function SortableRow({ habit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <span className={styles.dragHandle} {...attributes} {...listeners} aria-label="Drag to reorder">
        ☰
      </span>
      <span className={styles.habitName}>{habit.name}</span>
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
}

export function ManageView({ habits, onClose, onDelete, onReorder }: Props) {
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
