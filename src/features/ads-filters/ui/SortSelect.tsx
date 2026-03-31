import { useFiltersStore, SORT_OPTIONS } from '../model/useFiltersStore';
import styles from './SortSelect.module.css';

export function SortSelect() {
  const { sortIndex, setSortIndex } = useFiltersStore();

  return (
    <div className={styles.sortSelect}>
      <select
        className={styles.select}
        value={sortIndex}
        onChange={(e) => setSortIndex(Number(e.target.value))}
        id="sort-select"
      >
        {SORT_OPTIONS.map((opt, idx) => (
          <option key={idx} value={idx}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
