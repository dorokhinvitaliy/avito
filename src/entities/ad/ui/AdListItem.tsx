import { useNavigate } from 'react-router-dom';
import type { ItemListItem } from '../model/types';
import { formatPrice } from '../lib/formatters';
import { CategoryBadge } from './CategoryBadge';
import { getItemImageUrls } from '../lib/itemImages';
import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import styles from './AdListItem.module.css';

const badgeVariants: Variants = {
  initial: {
    width: '84px',
    padding: '4px 8px',
    borderRadius: '21px',
    backgroundColor: '#f59e0b',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  hover: {
    width: 'calc(100% - 8px)',
    padding: '12px 16px',
    borderRadius: '16px',
    backgroundColor: '#f59e0b',
  },
};

const textVariants: Variants = {
  initial: { 
    opacity: 0, 
    height: 0, 
    width: 0,
    marginTop: 0,
    overflow: 'hidden',
  },
  hover: {
    opacity: 1,
    height: 'auto',
    width: 'auto',
    marginTop: 4,
    transition: { delay: 0.1 },
  },
};

interface AdListItemProps {
  item: ItemListItem;
}

export function AdListItem({ item }: AdListItemProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const images = getItemImageUrls(item.id, item.category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = x / width;
    const newIndex = Math.floor(percent * images.length);
    if (newIndex >= 0 && newIndex < images.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(0);
  };

  return (
    <motion.article
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.listItem}
      onClick={() => navigate(`/ads/${item.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/ads/${item.id}`)}
    >
      <div 
        className={styles.imageWrapper}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={images[activeIndex]}
          alt={item.title}
          className={styles.mainImage}
        />

        {/* Pagination Indicators */}
        {images.length > 1 && (
          <div className={styles.pagination}>
            {images.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        )}

        {item.needsRevision && (
          <motion.div
            className={styles.review}
            variants={badgeVariants}
            initial="initial"
            whileHover="hover"
            layout="size"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            <div className={styles.reviewTitle}>Доработать</div>
            <motion.div 
              className={styles.reviewSubtitle}
              variants={textVariants}
            >
              В объявлении отсутствуют некоторые поля
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.title} title={item.title}>
            <span>{item.title}</span> <CategoryBadge category={item.category} className={styles.titleBadge} />
          </h3>
        </div>
        <span className={styles.price}>{formatPrice(item.price)}</span>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </div>
    </motion.article>
  );
}
