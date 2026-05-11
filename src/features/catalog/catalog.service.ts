import type {
  GameListRow,
  StorefrontCategorySearchHitRow,
  StorefrontProductSearchHitRow,
  StorefrontProductView,
  StorefrontCategoryRow,
} from "./catalog.repository";
import {
  findAllCategoriesForStorefront,
  findAllGamesForList,
  findProductByIdForStorefront,
  searchActiveProductsForStorefront,
  searchCategoriesForStorefront,
} from "./catalog.repository";

export type { GameListRow, StorefrontProductView };

export type StorefrontCategoryListItem = StorefrontCategoryRow;

export type StorefrontSearchResult = {
  categories: StorefrontCategorySearchHitRow[];
  products: StorefrontProductSearchHitRow[];
};

export async function listGames(): Promise<GameListRow[]> {
  return findAllGamesForList();
}

export async function listStorefrontCategories(): Promise<StorefrontCategoryListItem[]> {
  return findAllCategoriesForStorefront();
}

/** Public search limited to sensible page sizes from the storefront header. */
const SEARCH_LIMIT_CATEGORIES = 8;
const SEARCH_LIMIT_PRODUCTS = 12;

export async function searchStorefront(trimmedQuery: string): Promise<StorefrontSearchResult> {
  const categories = await searchCategoriesForStorefront(trimmedQuery, SEARCH_LIMIT_CATEGORIES);
  const products = await searchActiveProductsForStorefront(trimmedQuery, SEARCH_LIMIT_PRODUCTS);
  return { categories, products };
}

export async function getStorefrontProduct(productId: number): Promise<StorefrontProductView | null> {
  return findProductByIdForStorefront(productId);
}
