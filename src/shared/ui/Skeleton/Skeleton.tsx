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
      <Skeleton className={styles.image} />
      <div style={{ padding: '12px' }}>
        <Skeleton className={styles.text} width="60%" />
        <Skeleton className={styles.textLg} width="80%" />
        <Skeleton className={styles.text} width="40%" />
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className={styles.listItem}>
      <Skeleton className={styles.listImage} />
      <div className={styles.listContent}>
        <Skeleton className={styles.text} width="20%" height="12px" />
        <Skeleton className={styles.textLg} width="60%" />
        <Skeleton className={styles.text} width="30%" />
      </div>
    </div>
  );
}
