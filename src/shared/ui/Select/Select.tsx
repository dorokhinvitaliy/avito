import { type SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  warning?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, warning, options, placeholder, className = '', ...rest }, ref) => {
    const wrapperClass = [styles.wrapper, warning && styles.hasWarning, className]
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
        <select ref={ref} className={styles.select} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';
