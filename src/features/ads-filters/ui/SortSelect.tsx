import { useFiltersStore, SORT_OPTIONS } from '../model/useFiltersStore';
import { ToolbarSelect } from '../../../shared/ui/ToolbarSelect';
import styles from './SortSelect.module.css';

export function SortSelect() {
  const { sortIndex, setSortIndex } = useFiltersStore();

  const options = SORT_OPTIONS.map((opt, idx) => ({
    value: idx,
    label: opt.label,
  }));

  return (
    <div className={styles.sortSelect}>
      <ToolbarSelect
        value={sortIndex}
        onChange={(e: { target: { value: string } }) => setSortIndex(Number(e.target.value))}
        options={options}
      />
    </div>
  );
}
