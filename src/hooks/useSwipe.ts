import { useEffect, useRef } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe<T extends HTMLElement>({ onSwipeLeft, onSwipeRight }: UseSwipeOptions) {
  const ref = useRef<T>(null);
  // Store callbacks in refs so the effect never needs to re-run (no listener thrash)
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  onSwipeLeftRef.current = onSwipeLeft;
  onSwipeRightRef.current = onSwipeRight;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    function handleTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          onSwipeLeftRef.current?.();
        } else {
          onSwipeRightRef.current?.();
        }
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // stable — callbacks accessed via refs

  return ref;
}
