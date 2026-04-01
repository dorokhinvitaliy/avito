import { type ReactNode, useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'options'> {
  label?: ReactNode;
  error?: string;
  required?: boolean;
  warning?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, warning, options, placeholder, className = '', value, onChange, name, disabled, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const clickHandler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', clickHandler);
      return () => document.removeEventListener('mousedown', clickHandler);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayLabel = selectedOption ? selectedOption.label : placeholder || '';

    const handleSelect = (val: string | number) => {
      setIsOpen(false);
      if (onChange) {
        onChange({ target: { value: String(val), name } });
      }
    };

    const wrapperClass = [styles.wrapper, warning && styles.hasWarning, className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClass} ref={containerRef}>
        {label && (
          <label className={styles.label}>
            {required && <span className={styles.required}>*</span>}
            {label}
          </label>
        )}
        
        <div 
          className={`${styles.selectTrigger} ${isOpen ? styles.open : ''} ${error ? styles.errorBorder : ''} ${disabled ? styles.disabled : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={selectedOption ? styles.selectedValue : styles.placeholder}>
            {displayLabel}
          </span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={styles.iconWrapper}>
            <ChevronDown className={styles.icon} size={16} />
          </motion.div>
        </div>

        <div className={styles.dropdownContainer}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              >
                <ul className={styles.optionList}>
                  {options.map(opt => (
                    <li 
                      key={opt.value} 
                      className={`${styles.option} ${String(value) === String(opt.value) ? styles.selectedOption : ''}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <select ref={ref} value={value} onChange={() => {}} name={name} style={{ display: 'none' }} {...rest}>
          {options.map((opt) => (
             <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
