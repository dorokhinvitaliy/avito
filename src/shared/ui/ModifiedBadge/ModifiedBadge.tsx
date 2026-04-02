import { RotateCcw, AlertCircle } from 'lucide-react';
import styles from './ModifiedBadge.module.css';

interface ModifiedBadgeProps {
  originalValue?: string | number;
  onReset: () => void;
}

export function ModifiedBadge({ originalValue, onReset }: ModifiedBadgeProps) {
  const displayValue = originalValue !== undefined && originalValue !== null && originalValue !== '' 
    ? String(originalValue) 
    : 'пусто';

  return (
    <div className={styles.container}>
      <AlertCircle className={styles.icon} size={18} strokeWidth={2.5} />
      <div className={styles.tooltip}>
        <div className={styles.tooltipContent}>
          <span className={styles.label}>Оригинал:</span>
          <span className={styles.value}>{displayValue}</span>
        </div>
        <button 
          type="button" 
          className={styles.resetButton} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onReset();
          }}
        >
          <RotateCcw size={12} />
          <span>Вернуть как было</span>
        </button>
      </div>
    </div>
  );
}
