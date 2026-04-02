import type { ItemCategory } from '../model/types';
import { CATEGORY_LABELS } from '../lib/categoryLabels';
import styles from './CategoryBadge.module.css';

interface CategoryBadgeProps {
  category: ItemCategory;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[category]} ${className}`}>
      <span className={styles.dot} />
      {CATEGORY_LABELS[category]}
    </span>
  );
}
