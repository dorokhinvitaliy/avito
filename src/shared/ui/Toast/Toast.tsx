import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => removeToast(id), 5000); // slightly longer due to reading time
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`${styles.toast} ${styles[toast.type]}`}
            >
              <div className={styles.iconWrapper}>
                {toast.type === 'success' ? (
                  <Check size={18} strokeWidth={3.5} />
                ) : (
                  <X size={18} strokeWidth={3.5} />
                )}
              </div>
              <div className={styles.content}>
                <div className={styles.title}>{toast.title}</div>
                {toast.message && <div className={styles.message}>{toast.message}</div>}
              </div>
              <button
                aria-label="Закрыть"
                className={styles.close}
                onClick={() => removeToast(toast.id)}
              >
                <X size={14} strokeWidth={3} />
              </button>
              <motion.div
                className={styles.progressBar}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
