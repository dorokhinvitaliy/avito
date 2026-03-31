import { create } from 'zustand';
import type { ItemCategory, ItemSortColumn, SortDirection } from '../../../entities/ad';

export type LayoutMode = 'grid' | 'list';

export type SortOption = {
  label: string;
  column?: ItemSortColumn;
  direction?: SortDirection;
  clientSort?: 'price_asc' | 'price_desc';
};

export const SORT_OPTIONS: SortOption[] = [
  { label: 'По новизне (сначала новые)', column: 'createdAt', direction: 'desc' },
  { label: 'По новизне (сначала старые)', column: 'createdAt', direction: 'asc' },
  { label: 'По названию (А → Я)', column: 'title', direction: 'asc' },
  { label: 'По названию (Я → А)', column: 'title', direction: 'desc' },
  { label: 'По цене (сначала дешевле)', clientSort: 'price_asc' },
  { label: 'По цене (сначала дороже)', clientSort: 'price_desc' },
];

interface FiltersState {
  searchQuery: string;
  categories: ItemCategory[];
  needsRevision: boolean;
  sortIndex: number;
  layout: LayoutMode;
  page: number;

  setSearchQuery: (q: string) => void;
  toggleCategory: (cat: ItemCategory) => void;
  setNeedsRevision: (val: boolean) => void;
  setSortIndex: (idx: number) => void;
  setLayout: (mode: LayoutMode) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  searchQuery: '',
  categories: [],
  needsRevision: false,
  sortIndex: 0,
  layout: 'grid',
  page: 1,

  setSearchQuery: (q) => set({ searchQuery: q, page: 1 }),
  toggleCategory: (cat) =>
    set((state) => ({
      categories: state.categories.includes(cat)
        ? state.categories.filter((c) => c !== cat)
        : [...state.categories, cat],
      page: 1,
    })),
  setNeedsRevision: (val) => set({ needsRevision: val, page: 1 }),
  setSortIndex: (idx) => set({ sortIndex: idx, page: 1 }),
  setLayout: (mode) => set({ layout: mode }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      searchQuery: '',
      categories: [],
      needsRevision: false,
      sortIndex: 0,
      page: 1,
    }),
}));
