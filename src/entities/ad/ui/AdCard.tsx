import { useNavigate } from 'react-router-dom';
import type { ItemListItem } from '../model/types';
import { formatPrice } from '../lib/formatters';
import { CategoryBadge } from './CategoryBadge';
import { RevisionBadge } from './RevisionBadge';
import { ImagePlaceholder } from './ImagePlaceholder';
import { motion, type Variants } from 'framer-motion';
import styles from './AdCard.module.css';

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

interface AdCardProps {
  item: ItemListItem;
}

export function AdCard({ item }: AdCardProps) {
  const navigate = useNavigate();

  return (
    <motion.article
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.card}
      onClick={() => navigate(`/ads/${item.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/ads/${item.id}`)}
    >
      <div className={styles.imageWrapper}>
        <ImagePlaceholder />
      </div>
      <div className={styles.body}>
        <CategoryBadge category={item.category} />
        <h3 className={styles.title} title={item.title}>
          {item.title}
        </h3>
        <span className={styles.price}>{formatPrice(item.price)}</span>
        {item.needsRevision && <RevisionBadge />}
      </div>
    </motion.article>
  );
}
