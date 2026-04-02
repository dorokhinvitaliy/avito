import { useNavigate } from 'react-router-dom';
import type { ItemListItem } from '../model/types';
import { formatPrice } from '../lib/formatters';
import { CATEGORY_LABELS } from '../lib/categoryLabels';
import { ItemImage } from './ItemImage';
import { motion } from 'framer-motion';
import styles from './AdListItem.module.css';

interface AdListItemProps {
  item: ItemListItem;
}

export function AdListItem({ item }: AdListItemProps) {
  const navigate = useNavigate();

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
      <div className={styles.imageWrapper}>
        <ItemImage id={item.id} category={item.category} size="card" />
        {item.needsRevision && <div className={styles.review}>Доработать</div>}
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{CATEGORY_LABELS[item.category]}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.price}>{formatPrice(item.price)}</span>
      </div>
    </motion.article>
  );
}
