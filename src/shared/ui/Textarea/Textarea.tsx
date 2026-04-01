import { type TextareaHTMLAttributes, type ReactNode, forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  currentLength?: number;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, currentLength, maxLength, className = '', ...rest }, ref) => {
    const isNearLimit = maxLength && currentLength ? currentLength > maxLength * 0.9 : false;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea ref={ref} className={styles.textarea} maxLength={maxLength} {...rest} />
        {maxLength !== undefined && (
          <span className={`${styles.counter} ${isNearLimit ? styles.counterWarning : ''}`}>
            {currentLength ?? 0} / {maxLength}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
