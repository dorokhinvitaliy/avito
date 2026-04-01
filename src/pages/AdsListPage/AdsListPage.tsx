import { useQuery } from '@tanstack/react-query';
import { AdCard, AdListItem, fetchItems } from '../../entities/ad';
import type { ItemsQueryParams } from '../../entities/ad';
import {
  SearchBar,
  SortSelect,
  LayoutToggle,
  FiltersPanel,
  useFiltersStore,
  SORT_OPTIONS,
} from '../../features/ads-filters';
import { Pagination } from '../../shared/ui/Pagination';
import { SkeletonCard, Skeleton } from '../../shared/ui/Skeleton';
import { ErrorBlock } from '../../shared/ui/ErrorBlock';
import { useDebounce } from '../../shared/lib/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '../../shared/config/constants';
import { ClipboardList } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './AdsListPage.module.css';

export function AdsListPage() {
  const {
    searchQuery,
    categories,
    needsRevision,
    sortIndex,
    layout,
    page,
    setPage,
  } = useFiltersStore();

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

  const { data, isLoading, isError, refetch } = useQuery({
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Мои объявления</h1>
          {data && <span className={styles.count}>{data.total} объявлений</span>}
        </div>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <SearchBar />
          </div>
          <LayoutToggle />
          <SortSelect />
        </div>
      </header>

      <div className={styles.content}>
        <FiltersPanel />

        <div className={styles.main}>
          {isLoading && (
            <div className={layout === 'grid' ? styles.skeletonGrid : styles.skeletonList}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) =>
                layout === 'grid' ? (
                  <SkeletonCard key={i} />
                ) : (
                  <Skeleton
                    key={i}
                    height={100}
                    width="100%"
                    borderRadius="var(--radius-lg)"
                  />
                ),
              )}
            </div>
          )}

          {isError && <ErrorBlock onRetry={() => refetch()} />}

          {!isLoading && !isError && sortedItems.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <ClipboardList size={48} />
              </span>
              <h2 className={styles.emptyTitle}>Ничего не найдено</h2>
              <p className={styles.emptyText}>
                Попробуйте изменить параметры поиска или сбросить фильтры
              </p>
            </div>
          )}

          {!isLoading && !isError && sortedItems.length > 0 && (
            <>
              <AnimatePresence>
                <motion.div layout className={layout === 'grid' ? styles.grid : styles.list}>
                  {sortedItems.map((item) =>
                    layout === 'grid' ? (
                      <AdCard key={item.id} item={item} />
                    ) : (
                      <AdListItem key={item.id} item={item} />
                    ),
                  )}
                </motion.div>
              </AnimatePresence>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
