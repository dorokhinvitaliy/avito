import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/lib/hooks/useTheme';
import styles from './ThemeToggle.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className={styles.toggle}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Переключить тему"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2 }}
          className={styles.iconWrapper}
        >
          {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
