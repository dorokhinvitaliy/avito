import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { X } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  required?: boolean;
  warning?: boolean;
  onClear?: () => void;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, warning, onClear, suffix, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const wrapperClass = [
      styles.wrapper,
      error && styles.hasError,
      warning && styles.hasWarning,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const id = rest.id || generatedId;

    return (
      <div className={wrapperClass}>
        <div className={styles.inputWrapper}>
          <input ref={ref} id={id} className={styles.input} placeholder=" " {...rest} />
          {label && (
            <label className={styles.label} htmlFor={id}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          )}
          <div className={styles.suffixWrapper}>
            {suffix}
            {onClear && rest.value && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={onClear}
                aria-label="Очистить"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
