import { useFiltersStore } from '../model/useFiltersStore';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFiltersStore();

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.input}
        type="text"
        placeholder="Найти объявление...."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        id="search-input"
      />
      <span className={styles.icon}>🔍</span>
    </div>
  );
}
