import { useEffect } from 'react';
const ONE_MINUTE_MS = 60000;

export function useIntervalAction(action: () => void, intervalMin: number = 1) {
  useEffect(() => {
    action();

    let interval: ReturnType<typeof setInterval> | null = null;

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        action();
      }, intervalMin * ONE_MINUTE_MS);
      action();
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [action, intervalMin]);
}
