import { useFiltersStore } from '../model/useFiltersStore';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';
import { useState } from 'react';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFiltersStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Найти объявление...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id="search-input"
        />
        <span className={styles.icon}>
          <Search size={16} />
        </span>
      </div>
      <div className={`${styles.backdrop} ${isFocused ? styles.visible : ''}`}></div>
    </div>
  );
}
