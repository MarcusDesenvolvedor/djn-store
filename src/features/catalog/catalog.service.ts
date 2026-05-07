import type { GameListRow } from "./catalog.repository";
import { findAllGamesForList } from "./catalog.repository";

export type { GameListRow };

export async function listGames(): Promise<GameListRow[]> {
  return findAllGamesForList();
}
