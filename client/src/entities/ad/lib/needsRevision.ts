import type { Item, ItemCategory, ItemParams } from '../model/types';
import { EXPECTED_PARAMS, PARAM_LABELS_BY_CATEGORY } from './categoryLabels';

/**
 * Returns list of missing param labels (in Russian) for the given item.
 * Uses the same logic as backend: description must exist + all category params must be filled.
 */
export function getMissingFields(item: Item): string[] {
  const missing: string[] = [];

  if (!item.description) {
    missing.push('Описание');
  }

  const expectedKeys = EXPECTED_PARAMS[item.category] ?? [];
  const labels = PARAM_LABELS_BY_CATEGORY[item.category] ?? {};

  for (const key of expectedKeys) {
    const value = (item.params as Record<string, unknown>)[key];
    if (value === undefined || value === null || value === '') {
      missing.push(labels[key] ?? key);
    }
  }

  return missing;
}

/** Client-side check matching the server's doesItemNeedRevision */
export function doesItemNeedRevision(
  category: ItemCategory,
  description: string | undefined,
  params: ItemParams,
): boolean {
  if (!description) return true;

  const expectedKeys = EXPECTED_PARAMS[category] ?? [];

  for (const key of expectedKeys) {
    const value = (params as Record<string, unknown>)[key];
    if (value === undefined || value === null || value === '') return true;
  }

  return false;
}
