import { useState } from 'react';
import type { ItemCategory } from '../model/types';
import { getItemCoverUrl, getPhotoCount } from '../lib/itemImages';
import styles from './ItemImage.module.css';

interface ItemImageProps {
  id: number;
  category: ItemCategory;
  size?: 'thumbnail' | 'card';
  className?: string;
}

export function ItemImage({ id, category, size = 'card', className = '' }: ItemImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const coverUrl = getItemCoverUrl(id, category, size);
  const photoCount = getPhotoCount(id);

  if (error) {
    return (
      <div className={`${styles.placeholder} ${className}`}>
        <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
          <circle cx="8.5" cy="9.5" r="2" stroke="#9ca3af" strokeWidth="1.5" />
          <path d="M2 17l4.586-4.586a2 2 0 012.828 0L14 17" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {!loaded && <div className={styles.shimmer} />}
      <img
        src={coverUrl}
        alt=""
        className={`${styles.image} ${loaded ? styles.loaded : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
      {photoCount > 1 && (
        <span className={styles.badge}>{photoCount} фото</span>
      )}
    </div>
  );
}
