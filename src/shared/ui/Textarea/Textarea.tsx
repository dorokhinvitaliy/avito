import { type TextareaHTMLAttributes, type ReactNode, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  currentLength?: number;
  maxLength?: number;
  suffix?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, currentLength, maxLength, suffix, className = '', ...rest }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);

    const isNearLimit = maxLength && currentLength ? currentLength > maxLength * 0.9 : false;

    useEffect(() => {
      const textarea = localRef.current;
      if (!textarea) return;

      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      adjustHeight();
    }, [rest.value]);

    const id = rest.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${styles.wrapper} ${error ? styles.hasError : ''} ${className}`}>
        <div className={styles.textareaContainer}>
          <textarea
            ref={localRef}
            id={id}
            className={styles.textarea}
            placeholder=" "
            maxLength={maxLength}
            {...rest}
          />
          {label && (
            <label className={styles.label} htmlFor={id}>
              {label}
            </label>
          )}
          {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>
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
