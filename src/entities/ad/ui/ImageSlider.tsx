import { useState, useCallback } from 'react';
import type { ItemCategory } from '../model/types';
import { getItemImageUrls } from '../lib/itemImages';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  id: number;
  category: ItemCategory;
}

export function ImageSlider({ id, category }: ImageSliderProps) {
  const images = getItemImageUrls(id, category, 'full');
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setActiveIndex(index);
    },
    [activeIndex],
  );

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const isSingle = images.length === 1;

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        {images.map((url, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === activeIndex ? styles.active : ''}`}
          >
            {!loadedImages.has(i) && (
              <div className={styles.shimmer} />
            )}
            <img
              src={url}
              alt={`Фото ${i + 1}`}
              className={`${styles.image} ${loadedImages.has(i) ? styles.loaded : ''}`}
              onLoad={() => handleImageLoad(i)}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {!isSingle && (
          <>
            <button
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={goPrev}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={goNext}
              aria-label="Следующее фото"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {!isSingle && (
          <div className={styles.counter}>
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {!isSingle && (
        <div className={styles.thumbnails}>
          {images.map((url, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Фото ${i + 1}`}
            >
              <img
                src={url}
                alt=""
                className={styles.thumbImage}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
