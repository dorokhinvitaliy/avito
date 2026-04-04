import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchItem,
  formatPrice,
  formatDate,
  PARAM_LABELS_BY_CATEGORY,
  translateParamValue,
  getMissingFields,
  ImageSlider,
} from '@/entities/ad';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorBlock } from '@/shared/ui/ErrorBlock';
import { Pencil, TriangleAlert } from 'lucide-react';
import styles from './AdViewPage.module.css';

export function AdViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const { data: item, isLoading, isError, refetch } = useQuery({
    queryKey: ['item', numericId],
    queryFn: ({ signal }) => fetchItem(numericId, signal),
    enabled: !isNaN(numericId),
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader}>
          <div>
            <Skeleton width={300} height={32} />
            <Skeleton width={120} height={36} style={{ marginTop: 12 }} />
          </div>
          <Skeleton width={150} height={32} />
        </div>
        <Skeleton width="100%" height={1} style={{ margin: '24px 0' }} />
        <div className={styles.skeletonContent}>
          <Skeleton width={420} height={320} borderRadius="var(--radius-lg)" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="80%" height={16} style={{ marginTop: 16 }} />
            <Skeleton width="80%" height={16} style={{ marginTop: 8 }} />
            <Skeleton width="80%" height={16} style={{ marginTop: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className={styles.page}>
        <ErrorBlock
          title="Объявление не найдено"
          message="Не удалось загрузить данные объявления"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const missingFields = getMissingFields(item);
  const paramLabels = PARAM_LABELS_BY_CATEGORY[item.category];
  const filledParams = Object.entries(item.params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );

  return (
    <div className={styles.page}>
      <Link to="/ads" className={styles.backLink}>
        ← Вернуться к списку
      </Link>

      <div className={styles.topSection}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{item.title}</h1>
          <div className={styles.editButton}>
            <Button
              variant="primary"
              onClick={() => navigate(`/ads/${item.id}/edit`)}
              icon={<Pencil size={16} />}
            >
              Редактировать
            </Button>
          </div>
        </div>

        <div className={styles.priceGroup}>
          <div className={styles.price}>{formatPrice(item.price)}</div>
          <div className={styles.dates}>
            <span>Опубликовано: {formatDate(item.createdAt)}</span>
            {item.updatedAt !== item.createdAt && (
              <span>Отредактировано: {formatDate(item.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.mainContent}>
        <div className={styles.imageSection}>
          <ImageSlider id={item.id} category={item.category} />
        </div>

        <div className={styles.infoSection}>
          {missingFields.length > 0 && (
            <div className={styles.warningBlock}>
              <div className={styles.warningContent}>
                <h3>
                  {' '}
                  <TriangleAlert size={20} style={{ verticalAlign: 'middle' }} />{' '}
                  <span>Требуются доработки</span>
                </h3>
                <p>У объявления не заполнены поля:</p>
                <ul className={styles.warningList}>
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {filledParams.length > 0 && (
            <div>
              <h2 className={styles.specsTitle}>Характеристики</h2>
              <div className={styles.specsTable}>
                {filledParams.map(([key, value]) => (
                  <div key={key} className={styles.specRow}>
                    <span className={styles.specLabel}>{paramLabels[key] ?? key}</span>
                    <span className={styles.specValue}>
                      {translateParamValue(item.category, key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Описание</h2>
        {item.description ? (
          <p className={styles.descriptionText}>{item.description}</p>
        ) : (
          <p className={`${styles.descriptionText} ${styles.noDescription}`}>Отсутствует</p>
        )}
      </div>
    </div>
  );
}
