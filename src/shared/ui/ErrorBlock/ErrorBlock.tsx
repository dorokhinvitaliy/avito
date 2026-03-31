import { Button } from '../Button';
import styles from './ErrorBlock.module.css';

interface ErrorBlockProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorBlock({
  title = 'Произошла ошибка',
  message = 'Не удалось загрузить данные. Попробуйте ещё раз.',
  onRetry,
}: ErrorBlockProps) {
  return (
    <div className={styles.errorBlock}>
      <span className={styles.icon}>⚠️</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}
