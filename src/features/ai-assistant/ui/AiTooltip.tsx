import { useLayoutEffect, useRef } from 'react';
import { Button } from '../../../shared/ui/Button';
import ReactMarkdown from 'react-markdown';
import styles from './AiTooltip.module.css';
import { motion } from 'framer-motion';

interface AiTooltipProps {
  content: string;
  isError?: boolean;
  onApply?: () => void;
  onClose: () => void;
  applyLabel?: string;
}

export function AiTooltip({
  content,
  isError,
  onApply,
  onClose,
  applyLabel = 'Применить',
}: AiTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const rect = tooltip.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Vertical flip logic
    if (rect.bottom > viewportHeight) {
      const spaceAbove = rect.top - rect.height;
      if (spaceAbove > 0) {
        tooltip.classList.add(styles.tooltipTop);
        tooltip.classList.remove(styles.tooltipBottom);
      }
    }

    // Horizontal safety: if tooltip overflows right edge, nudge it left
    if (rect.right > viewportWidth) {
      const overflow = rect.right - viewportWidth + 12; // 12px padding from edge
      tooltip.style.left = `-${overflow}px`;
    }
  }, [content]);

  const positionClass = styles.tooltipBottom;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      ref={tooltipRef}
      className={`${styles.tooltip} ${positionClass} ${isError ? styles.tooltipError : ''}`}
    >
      <div className={`${styles.header} ${isError ? styles.errorHeader : ''}`}>
        {isError ? 'Произошла ошибка при запросе к AI' : 'Ответ AI:'}
      </div>
      <div className={`${styles.content} ${isError ? styles.errorContent : ''}`}>
        {isError ? (
          'Попробуйте повторить запрос или закройте уведомление'
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
      <div className={styles.actions}>
        {onApply && !isError && (
          <Button type="button" variant="primary" size="sm" onClick={onApply}>
            {applyLabel}
          </Button>
        )}
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </motion.div>
  );
}
