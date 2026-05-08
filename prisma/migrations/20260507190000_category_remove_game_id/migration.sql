-- Category is standalone (name only); no FK to Game.

ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_gameId_fkey";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "gameId";
