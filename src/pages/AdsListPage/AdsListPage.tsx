import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdCard, AdListItem, fetchItems } from '@/entities/ad';
import type { ItemsQueryParams } from '@/entities/ad';
import {
  SearchBar,
  SortSelect,
  LayoutToggle,
  FiltersPanel,
  useFiltersStore,
  SORT_OPTIONS,
} from '@/features/ads-filters';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/shared/config/constants';
import { ClipboardList } from 'lucide-react';
import {
  ErrorBlock,
  Flex,
  Grid,
  Pagination,
  SkeletonCard,
  SkeletonListItem,
  Stack,
  Typography,
} from '@/shared/ui';
import styles from './AdsListPage.module.css';

export function AdsListPage() {
  const { searchQuery, categories, needsRevision, sortIndex, layout, page, setPage } =
    useFiltersStore();

  const debouncedSearch = useDebounce(searchQuery, 400);
  const currentSort = SORT_OPTIONS[sortIndex];
  const isClientSort = Boolean(currentSort.clientSort);

  const queryParams: ItemsQueryParams = {
    q: debouncedSearch || undefined,
    limit: ITEMS_PER_PAGE,
    skip: (page - 1) * ITEMS_PER_PAGE,
    categories: categories.length > 0 ? categories : undefined,
    needsRevision: needsRevision || undefined,
    sortColumn: isClientSort ? undefined : currentSort.column,
    sortDirection: isClientSort ? undefined : currentSort.direction,
  };

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['items', queryParams],
    queryFn: ({ signal }) => fetchItems(queryParams, signal),
    placeholderData: (prev) => prev,
  });

  // Client-side sort for price (server doesn't support it)
  const sortedItems = (() => {
    if (!data?.items || !isClientSort) return data?.items ?? [];
    const sorted = [...data.items];
    sorted.sort((a, b) => {
      if (currentSort.clientSort === 'price_asc') return a.price - b.price;
      return b.price - a.price;
    });
    return sorted;
  })();

  const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE);

  const prevPageRef = useRef(page);

  useEffect(() => {
    if (!isFetching && page !== prevPageRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevPageRef.current = page;
    }
    // Update ref even if it was a filter change that kept the same page
    if (!isFetching) {
      prevPageRef.current = page;
    }
  }, [isFetching, page]);

  return (
    <div className={styles.page}>
      <Stack gap={6} as="header" className={styles.header}>
        <Flex align="baseline" gap={3}>
          <Typography variant="h2" as="h1">
            Мои объявления
          </Typography>
          {data && (
            <Typography variant="body2" color="tertiary">
              {data.total} объявлений
            </Typography>
          )}
        </Flex>
        <Flex align="center" gap={4} wrap className={styles.toolbar}>
          <SearchBar />
          <LayoutToggle />
          <SortSelect />
        </Flex>
      </Stack>

      <div className={styles.content}>
        <FiltersPanel />

        <main className={styles.main}>
          <Stack gap={layout === 'grid' ? 4 : 3}>
            {isFetching && (
              <Grid
                cols={layout === 'grid' ? 4 : 1}
                minColWidth={layout === 'grid' ? 180 : undefined}
                gap={layout === 'grid' ? { base: 2, sm: 4 } : 3}
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) =>
                  layout === 'grid' ? <SkeletonCard key={i} /> : <SkeletonListItem key={i} />,
                )}
              </Grid>
            )}

            {isError && <ErrorBlock onRetry={() => refetch()} />}

            {!isFetching && !isError && sortedItems.length === 0 && (
              <Stack align="center" justify="center" gap={4} className={styles.emptyState}>
                <span className={styles.emptyIcon}>
                  <ClipboardList size={48} />
                </span>
                <Stack align="center" gap={2}>
                  <Typography variant="h3" align="center">
                    Ничего не найдено
                  </Typography>
                  <Typography variant="body1" color="secondary" align="center">
                    Попробуйте изменить параметры поиска или сбросить фильтры
                  </Typography>
                </Stack>
              </Stack>
            )}

            {!isFetching && !isError && sortedItems.length > 0 && (
              <Grid
                cols={layout === 'grid' ? 4 : 1}
                minColWidth={layout === 'grid' ? 180 : undefined}
                gap={layout === 'grid' ? { base: 2, sm: 4 } : 3}
              >
                {sortedItems.map((item) =>
                  layout === 'grid' ? (
                    <AdCard key={item.id} item={item} />
                  ) : (
                    <AdListItem key={item.id} item={item} />
                  ),
                )}
              </Grid>
            )}
          </Stack>

          {!isError && totalPages > 0 && (
            <div style={{ marginTop: '32px' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
