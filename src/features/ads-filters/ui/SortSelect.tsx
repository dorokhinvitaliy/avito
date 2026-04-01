import { useFiltersStore, SORT_OPTIONS } from '../model/useFiltersStore';
import { Select } from '../../../shared/ui/Select';
import styles from './SortSelect.module.css';

export function SortSelect() {
  const { sortIndex, setSortIndex } = useFiltersStore();

  const options = SORT_OPTIONS.map((opt, idx) => ({
    value: idx,
    label: opt.label,
  }));

  return (
    <div className={styles.sortSelect}>
      <Select
        value={sortIndex}
        onChange={(e) => setSortIndex(Number(e.target.value))}
        options={options}
      />
    </div>
  );
}
