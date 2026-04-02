import { type CSSProperties } from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width, height, borderRadius, className = '', style }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.cardImage} />
      <div className={styles.cardBody}>
        <Skeleton className={styles.text} width="100%" />
        <div className={styles.cardPriceRow}>
          <Skeleton className={styles.textLg} width="40%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className={styles.listItem}>
      <Skeleton className={styles.listImage} />
      <div className={styles.listContent}>
        <div className={styles.listHeader}>
          <Skeleton className={styles.badge} width="60px" height="20px" borderRadius="9px" />
          <Skeleton className={styles.textLg} width="70%" />
        </div>
        <Skeleton className={styles.textPrice} width="120px" height="24px" />
        <div className={styles.listFooter}>
          <Skeleton className={styles.text} width="40%" />
        </div>
      </div>
    </div>
  );
}
