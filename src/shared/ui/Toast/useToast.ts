import { createContext, useContext } from 'react';

type ToastType = 'success' | 'error';

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
