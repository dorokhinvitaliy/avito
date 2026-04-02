import { type TextareaHTMLAttributes, type ReactNode, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  currentLength?: number;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, currentLength, maxLength, className = '', ...rest }, ref) => {
    const isNearLimit = maxLength && currentLength ? currentLength > maxLength * 0.9 : false;

    return (
      <div className={`${styles.wrapper} ${error ? styles.hasError : ''} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea ref={ref} className={styles.textarea} maxLength={maxLength} {...rest} />
        <div className={styles.footer}>
          {error && <span className={styles.error}>{error}</span>}
          {maxLength !== undefined && (
            <span className={`${styles.counter} ${isNearLimit ? styles.counterWarning : ''}`}>
              {currentLength ?? 0} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
