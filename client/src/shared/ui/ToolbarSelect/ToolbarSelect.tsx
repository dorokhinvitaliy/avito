import { type ReactNode, useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import styles from './ToolbarSelect.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface ToolbarSelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export const ToolbarSelect = forwardRef<HTMLDivElement, ToolbarSelectProps>(
  ({ options, value, onChange, name, disabled, className = '', icon }, ref) => {
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

    const handleSelect = (val: string | number) => {
      setIsOpen(false);
      if (onChange) {
        onChange({ target: { value: String(val), name } });
      }
    };

    return (
      <div className={`${styles.wrapper} ${className}`} ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}>
        <div 
          className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
        >
          <div className={styles.leftContent}>
            <span className={styles.mainIcon}>
              {icon || <ArrowUpDown size={16} />}
            </span>
            <span className={styles.value}>
              {selectedOption ? selectedOption.label : 'Выберите...'}
            </span>
          </div>
          
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            className={styles.chevron}
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95, transition: { duration: 0.1 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 450 }}
            >
              <ul className={styles.optionList}>
                {options.map(opt => (
                  <li 
                    key={opt.value} 
                    className={`${styles.option} ${String(value) === String(opt.value) ? styles.selected : ''}`}
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
    );
  }
);

ToolbarSelect.displayName = 'ToolbarSelect';
