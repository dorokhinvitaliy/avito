import type { ItemCategory } from '../model/types';

/**
 * Generates deterministic, category-aware image URLs for ads.
 * Uses picsum.photos with seeded IDs so the same ad always shows
 * the same images, but different ads look different.
 *
 * Quantity of photos varies per ad (1–5) based on id % 5 + 1.
 */
const CATEGORY_KEYWORDS: Record<ItemCategory, string> = {
  auto: 'car',
  real_estate: 'house',
  electronics: 'gadget',
};
/**
 * Returns a deterministic number of photos for an ad (1–5).
 */
export function getPhotoCount(id: number): number {
  return (id % 5) + 1;
}

/**
 * Returns a single deterministic LoremFlickr image URL for a given category, ad + photo index.
 * Uses the `lock` param so the same id+index always returns the same image.
 * Width/height are passed for the desired resolution.
 */
function getFlickrUrl(
  category: ItemCategory,
  id: number,
  index: number,
  width: number,
  height: number,
): string {
  const keyword = CATEGORY_KEYWORDS[category] || 'object';
  // lock is a combination of ad id and photo index to ensure uniqueness
  const lock = id * 10 + index;
  return `https://loremflickr.com/${width}/${height}/${keyword}?lock=${lock}`;
}


/**
 * Returns an array of image URLs for an ad.
 * For list/grid cards, use smaller dimensions. For slider, use larger.
 */
export function getItemImageUrls(
  id: number,
  category: ItemCategory,
  size: 'thumbnail' | 'card' | 'full' = 'card',
): string[] {
  const count = getPhotoCount(id);

  const dimensions: Record<string, [number, number]> = {
    thumbnail: [200, 150],
    card: [400, 300],
    full: [800, 600],
  };

  const [w, h] = dimensions[size];

  return Array.from({ length: count }, (_, i) =>
    getFlickrUrl(category, id, i, w, h),
  );
}

/**
 * Returns the first (cover) image URL for an ad.
 */
export function getItemCoverUrl(
  id: number,
  category: ItemCategory,
  size: 'thumbnail' | 'card' | 'full' = 'card',
): string {
  const dimensions: Record<string, [number, number]> = {
    thumbnail: [200, 150],
    card: [400, 300],
    full: [800, 600],
  };

  const [w, h] = dimensions[size];
  return getFlickrUrl(category, id, 0, w, h);
}
