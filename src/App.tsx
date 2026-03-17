import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { useCompletions } from './hooks/useCompletions';
import { useSwipe } from './hooks/useSwipe';
import { addDays } from './lib/dates';
import { DateHeader } from './components/DateHeader/DateHeader';
import { HabitList } from './components/HabitList/HabitList';
import { FAB } from './components/FAB/FAB';
import { AddHabitModal } from './components/AddHabitModal/AddHabitModal';
import { ManageView } from './components/ManageView/ManageView';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState<'main' | 'manage'>('main');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  const { habits, addHabit, deleteHabit, reorderHabits } = useHabits();
  const { toggleCompletion, isComplete } = useCompletions();

  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => setSelectedDate((d) => addDays(d, 1)),
    onSwipeRight: () => setSelectedDate((d) => addDays(d, -1)),
  });

  return (
    <div ref={swipeRef} className={styles.app}>
      {view === 'main' && (
        <>
          <DateHeader
            date={selectedDate}
            onDateChange={setSelectedDate}
            onManage={() => setView('manage')}
          />
          <main className={styles.main}>
            <HabitList
              habits={habits}
              date={selectedDate}
              isComplete={isComplete}
              onToggle={toggleCompletion}
            />
          </main>
          <FAB onClick={() => setShowAddModal(true)} />
          {showAddModal && (
            <AddHabitModal
              onAdd={addHabit}
              onClose={() => setShowAddModal(false)}
            />
          )}
        </>
      )}

      {view === 'manage' && (
        <ManageView
          habits={habits}
          onClose={() => setView('main')}
          onDelete={deleteHabit}
          onReorder={reorderHabits}
        />
      )}
    </div>
  );
}
