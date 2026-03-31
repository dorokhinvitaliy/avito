import { useFiltersStore, type LayoutMode } from '../model/useFiltersStore';
import styles from './LayoutToggle.module.css';

export function LayoutToggle() {
  const { layout, setLayout } = useFiltersStore();

  const handleClick = (mode: LayoutMode) => setLayout(mode);

  return (
    <div className={styles.toggleWrapper}>
      <button
        className={`${styles.toggleButton} ${layout === 'grid' ? styles.active : ''}`}
        onClick={() => handleClick('grid')}
        aria-label="Сеткой"
        title="Сеткой"
        id="layout-grid-btn"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      </button>
      <button
        className={`${styles.toggleButton} ${layout === 'list' ? styles.active : ''}`}
        onClick={() => handleClick('list')}
        aria-label="Списком"
        title="Списком"
        id="layout-list-btn"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" />
          <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor" />
          <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
