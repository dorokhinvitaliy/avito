import { useState } from 'react';
import { Checkbox } from '../../../shared/ui/Checkbox/Checkbox';
import { Toggle } from '../../../shared/ui/Toggle/Toggle';
import { Button } from '../../../shared/ui/Button/Button';
import { useFiltersStore } from '../model/useFiltersStore';
import type { ItemCategory } from '../../../entities/ad';
import { CATEGORY_LABELS } from '../../../entities/ad';
import styles from './FiltersPanel.module.css';

const CATEGORIES: ItemCategory[] = ['auto', 'electronics', 'real_estate'];

export function FiltersPanel() {
  const { categories, needsRevision, toggleCategory, setNeedsRevision, resetFilters } =
    useFiltersStore();
  const [categoryOpen, setCategoryOpen] = useState(true);

  const hasActiveFilters = categories.length > 0 || needsRevision;

  return (
    <aside className={styles.panel}>
      <div className={styles.section}>
        <div
          className={styles.sectionHeader}
          onClick={() => setCategoryOpen(!categoryOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setCategoryOpen(!categoryOpen)}
        >
          <span className={styles.sectionTitle}>Категория</span>
          <span className={`${styles.chevron} ${categoryOpen ? styles.chevronOpen : ''}`}>▾</span>
        </div>

        {categoryOpen && (
          <div className={styles.checkboxList}>
            {CATEGORIES.map((cat) => (
              <Checkbox
                key={cat}
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                label={CATEGORY_LABELS[cat]}
                id={`filter-category-${cat}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <Toggle
        checked={needsRevision}
        onChange={setNeedsRevision}
        label="Только требующие доработок"
        id="filter-needs-revision"
      />

      <div className={styles.divider} />

      <Button
        variant="secondary"
        fullWidth
        onClick={resetFilters}
        disabled={!hasActiveFilters}
        id="filter-reset-btn"
      >
        Сбросить фильтры
      </Button>
    </aside>
  );
}
