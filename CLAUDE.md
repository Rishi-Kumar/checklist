# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev -- --host   # dev server with network access (use --host to test on iPhone)
npm run build           # production build (runs tsc -b then vite build)
npm run lint            # eslint check
```

No test suite exists yet.

## Architecture

**Stack:** React + Vite + TypeScript, CSS Modules, vite-plugin-pwa (service worker), @dnd-kit (drag-to-reorder). No backend — all data in `localStorage`.

**Data model** (`src/lib/types.ts`):
- `Habit` — `{ id, name, order, createdAt }` stored under key `"habits"`
- `Completion` — `{ habitId, date: "YYYY-MM-DD" }` stored under key `"completions"`

**Storage layer** (`src/lib/storage.ts`): thin wrappers around `localStorage` with try/catch for private browsing. Generic `getFromStorage<T>` / `setToStorage<T>` helpers back all four public functions.

**State management** — no global store. Two hooks own all state:
- `useHabits` — habits array + add/delete/reorder, writes to localStorage on each mutation
- `useCompletions` — completions array + toggle/isComplete, also exposes raw `completions` for derived stats

**Derived data** is computed in `App.tsx` from the raw `completions` array (e.g. score `done/total` for the header). Streak logic lives in `src/lib/stats.ts` (`getStreak`) and is called per-habit in `HabitList`.

**Views** — `App.tsx` switches between `'main'` and `'manage'` via a string union state. `ManageView` is a `position: fixed` full-screen overlay with a slide-in CSS animation; it does not use a router.

**Swipe navigation** — `useSwipe` attaches passive `touchstart`/`touchend` listeners to the app root div. Callbacks are stored in refs so the effect only runs once (no listener thrash on re-render).

## iOS Safari Notes

- **No `overflow: hidden` on the app wrapper** — kills touch events on `position: fixed` children (FAB, modals) on iOS Safari.
- **`visualViewport` in `AddHabitModal`** — adjusts `marginBottom` of the sheet when the keyboard opens so the input/submit button stay visible.
- **`crypto.randomUUID()` fallback** — not available on iOS < 15.4; `useHabits` falls back to a `Date.now()` + `Math.random()` id.
- Safe area insets used via `env(safe-area-inset-bottom)` for FAB and scroll padding.
