import type { GameListRow, StorefrontProductView } from "./catalog.repository";
import { findAllGamesForList, findProductByIdForStorefront } from "./catalog.repository";

export type { GameListRow, StorefrontProductView };

export async function listGames(): Promise<GameListRow[]> {
  return findAllGamesForList();
}

export async function getStorefrontProduct(productId: number): Promise<StorefrontProductView | null> {
  return findProductByIdForStorefront(productId);
}
