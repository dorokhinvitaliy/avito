export type ItemCategory = 'auto' | 'real_estate' | 'electronics';

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

export type ItemParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams;

export interface Item {
  id: number;
  category: ItemCategory;
  title: string;
  description?: string;
  price: number | null;
  createdAt: string;
  updatedAt: string;
  params: ItemParams;
  needsRevision?: boolean;
}

export interface ItemListItem {
  id: number;
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  needsRevision: boolean;
}

export interface ItemsListResponse {
  items: ItemListItem[];
  total: number;
}

export interface ItemUpdatePayload {
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  params: ItemParams;
}

export type ItemSortColumn = 'title' | 'createdAt';

export type SortDirection = 'asc' | 'desc';

export interface ItemsQueryParams {
  q?: string;
  limit?: number;
  skip?: number;
  categories?: ItemCategory[];
  needsRevision?: boolean;
  sortColumn?: ItemSortColumn;
  sortDirection?: SortDirection;
}
