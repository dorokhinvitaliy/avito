import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { X } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  warning?: boolean;
  onClear?: () => void;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, warning, onClear, suffix, className = '', ...rest }, ref) => {
    const wrapperClass = [
      styles.wrapper,
      error && styles.hasError,
      warning && styles.hasWarning,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClass}>
        {label && (
          <label className={styles.label}>
            {required && <span className={styles.required}>*</span>}
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          <input ref={ref} className={styles.input} {...rest} />
          {onClear && rest.value && (
            <button type="button" className={styles.clearButton} onClick={onClear} aria-label="Очистить">
              <X size={14} />
            </button>
          )}
          {suffix}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
