import { Button } from '../../../shared/ui/Button';
import styles from './AiTooltip.module.css';

interface AiTooltipProps {
  content: string;
  isError?: boolean;
  onApply?: () => void;
  onClose: () => void;
  applyLabel?: string;
}

export function AiTooltip({ content, isError, onApply, onClose, applyLabel = 'Применить' }: AiTooltipProps) {
  return (
    <div className={`${styles.tooltip} ${isError ? styles.tooltipError : ''}`}>
      <div className={`${styles.header} ${isError ? styles.errorHeader : ''}`}>
        {isError ? 'Произошла ошибка при запросе к AI' : 'Ответ AI:'}
      </div>
      <div className={`${styles.content} ${isError ? styles.errorContent : ''}`}>
        {isError
          ? 'Попробуйте повторить запрос или закройте уведомление'
          : content}
      </div>
      <div className={styles.actions}>
        {onApply && !isError && (
          <Button variant="primary" size="sm" onClick={onApply}>
            {applyLabel}
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onClose}>
          Закрыть
        </Button>
      </div>
    </div>
  );
}
