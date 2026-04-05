import styles from './RevisionBadge.module.css';

export function RevisionBadge() {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} />
      Требует доработок
    </span>
  );
}
