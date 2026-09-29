'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MATCH_DURATION } from './territoryLogic';

interface UseMatchTimerOptions {
  duration?: number;
  isRunning?: boolean;
  onTimeExpired: () => void;
}

export function useMatchTimer({
  duration = MATCH_DURATION,
  isRunning = true,
  onTimeExpired,
}: UseMatchTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(duration);
  const onTimeExpiredRef = useRef(onTimeExpired);
  onTimeExpiredRef.current = onTimeExpired;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(
    (newDuration: number = duration) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRemainingSeconds(newDuration);
    },
    [duration]
  );

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Defer callback to avoid React state mutation warning
          setTimeout(() => {
            onTimeExpiredRef.current();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  return {
    remainingSeconds,
    resetTimer,
  };
}
