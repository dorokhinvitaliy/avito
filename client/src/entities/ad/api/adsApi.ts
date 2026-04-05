import { apiClient } from '../../../shared/api/apiClient';
import type { Item, ItemsListResponse, ItemsQueryParams, ItemUpdatePayload } from '../model/types';

export async function fetchItems(
  params: ItemsQueryParams,
  signal?: AbortSignal,
): Promise<ItemsListResponse> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip));
  if (params.categories?.length) searchParams.set('categories', params.categories.join(','));
  if (params.needsRevision) searchParams.set('needsRevision', 'true');
  if (params.sortColumn) searchParams.set('sortColumn', params.sortColumn);
  if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection);

  const { data } = await apiClient.get<ItemsListResponse>(`/items?${searchParams.toString()}`, {
    signal,
  });

  return data;
}

export async function fetchItem(id: number, signal?: AbortSignal): Promise<Item> {
  const { data } = await apiClient.get<Item>(`/items/${id}`, { signal });
  return data;
}

export async function updateItem(id: number, payload: ItemUpdatePayload): Promise<void> {
  await apiClient.put(`/items/${id}`, payload);
}
