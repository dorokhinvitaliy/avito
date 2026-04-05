import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { Flex } from '@/shared/ui';
import { Typography } from '@/shared/ui';
import { DiffViewer } from '../DiffViewer';
import styles from './DiffModal.module.css';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldText: string;
  newText: string;
  title?: string;
}

export function DiffModal({ isOpen, onClose, oldText, newText, title = 'Сравнение версий' }: DiffModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.header}>
              <Flex justify="between" align="center">
                <Typography variant="h3">{title}</Typography>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  icon={<X size={20} />} 
                />
              </Flex>
            </div>
            
            <div className={styles.content}>
              <DiffViewer 
                oldText={oldText} 
                newText={newText} 
                variant="side-by-side" 
              />
            </div>
            
            <div className={styles.footer}>
              <Flex justify="end">
                <Button type="button" variant="primary" onClick={onClose}>
                  Закрыть просмотр
                </Button>
              </Flex>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
