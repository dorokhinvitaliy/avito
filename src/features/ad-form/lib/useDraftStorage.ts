import { useEffect, useCallback, useRef } from 'react';

const DRAFT_PREFIX = 'avito_draft_';

export function useDraftStorage<T>(
  adId: number,
  currentData: T | null,
  onRestore: (data: T) => void,
) {
  const key = `${DRAFT_PREFIX}${adId}`;
  const restoredRef = useRef(false);

  // Try restoring draft on mount
  useEffect(() => {
    if (restoredRef.current) return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        onRestore(parsed);
        restoredRef.current = true;
      }
    } catch {
      localStorage.removeItem(key);
    }
  }, [key, onRestore]);

  const saveDraft = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        // Storage full, ignore
      }
    },
    [key],
  );

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  const hasDraft = useCallback(() => {
    return localStorage.getItem(key) !== null;
  }, [key]);

  return { saveDraft, clearDraft, hasDraft };
}
