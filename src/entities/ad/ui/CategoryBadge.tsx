import type { ItemCategory } from '../model/types';
import { CATEGORY_LABELS } from '../lib/categoryLabels';
import styles from './CategoryBadge.module.css';

interface CategoryBadgeProps {
  category: ItemCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
