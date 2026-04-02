import { RotateCcw } from 'lucide-react';
import styles from './ModifiedBadge.module.css';

interface ModifiedBadgeProps {
  originalValue?: string | number;
  onReset: () => void;
}

export function ModifiedBadge({ originalValue, onReset }: ModifiedBadgeProps) {
  // If originalValue is undefined or null, we might not want to show it, 
  // but usually it means it was previously empty.
  const displayValue = originalValue !== undefined && originalValue !== null && originalValue !== '' 
    ? String(originalValue) 
    : 'пусто';

  return (
    <div className={styles.wrapper}>
      <span className={styles.badge}>
        изменено
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
            title="Сбросить к оригиналу"
          >
            <RotateCcw size={12} />
            <span>Сбросить</span>
          </button>
        </div>
      </span>
    </div>
  );
}
