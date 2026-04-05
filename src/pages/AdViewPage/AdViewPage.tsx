import { useParams, useNavigate } from 'react-router-dom';
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
import { Pencil, TriangleAlert } from 'lucide-react';
import { BackLink, Button, ErrorBlock, Flex, Skeleton, Stack, Card, Typography } from '@/shared/ui';
import styles from './AdViewPage.module.css';

export function AdViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
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
      <BackLink to="/ads">Вернуться к списку</BackLink>

      <Stack gap={6}>
        {/* Header Section */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="between"
          align={{ base: 'stretch', sm: 'start' }}
          wrap
          className={styles.topSection}
        >
          <Flex direction={{ base: 'column', sm: 'column' }} gap={4} align="start">
            <Typography variant="h2">{item.title}</Typography>
            <Button
              variant="primary"
              onClick={() => navigate(`/ads/${item.id}/edit`)}
              icon={<Pencil size={16} />}
            >
              Редактировать
            </Button>
          </Flex>
          <Flex
            direction={{ base: 'row', sm: 'column' }}
            justify={'between'}
            align="end"
            gap={2}
            wrap
          >
            <Typography variant="h2" weight="bold">
              {formatPrice(item.price)}
            </Typography>
            <Flex direction="column" align="end" gap={1}>
              <Typography variant="caption" color="tertiary">
                Опубликовано: {formatDate(item.createdAt)}
              </Typography>
              {item.updatedAt !== item.createdAt && (
                <Typography variant="caption" color="tertiary">
                  Отредактировано: {formatDate(item.updatedAt)}
                </Typography>
              )}
            </Flex>
          </Flex>
        </Flex>

        <div className={styles.mainContent}>
          <div className={styles.imageSection}>
            <ImageSlider id={item.id} category={item.category} />
          </div>

          <div className={styles.infoSection}>
            {missingFields.length > 0 && (
              <Card padding={6} className={styles.warningCard}>
                <Stack gap={3}>
                  <Flex align="center" gap={2}>
                    <TriangleAlert size={20} className={styles.warningIconColor} />
                    <Typography variant="h4" as="h3" className={styles.warningTitle}>
                      Требуются доработки
                    </Typography>
                  </Flex>
                  <Typography variant="body1" className={styles.warningText}>
                    У объявления не заполнены поля:
                  </Typography>
                  <ul className={styles.warningList}>
                    {missingFields.map((field) => (
                      <li key={field}>
                        <Typography variant="body2">{field}</Typography>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Card>
            )}

            {filledParams.length > 0 && (
              <Stack gap={4}>
                <Typography variant="h4" as="h2">
                  Характеристики
                </Typography>
                <Stack gap={2}>
                  {filledParams.map(([key, value]) => (
                    <Flex key={key} gap={4}>
                      <Typography variant="body2" color="secondary" className={styles.specLabel}>
                        {paramLabels[key] ?? key}
                      </Typography>
                      <Typography variant="body2" weight="medium">
                        {translateParamValue(item.category, key, value)}
                      </Typography>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            )}
          </div>
        </div>

        <Stack gap={4}>
          <Typography variant="h4" as="h2">
            Описание
          </Typography>
          {item.description ? (
            <Typography variant="body1" className={styles.descriptionText}>
              {item.description}
            </Typography>
          ) : (
            <Typography variant="body1" color="tertiary" className={styles.noDescription}>
              Отсутствует
            </Typography>
          )}
        </Stack>
      </Stack>
    </div>
  );
}
