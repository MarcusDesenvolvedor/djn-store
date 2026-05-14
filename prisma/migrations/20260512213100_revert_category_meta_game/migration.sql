-- Reverte columnas/indice relacionados ao meta‑jogo de categorias (hierarquia, seasons, slug, modo, isActive no Category).

ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_gameSeasonId_fkey";
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_parentId_fkey";
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_gameId_fkey";

DROP INDEX IF EXISTS "Category_gameSeasonId_idx";
DROP INDEX IF EXISTS "Category_parentId_idx";
DROP INDEX IF EXISTS "Category_gameId_idx";
DROP INDEX IF EXISTS "Category_gameId_slug_key";

ALTER TABLE "Category" DROP COLUMN IF EXISTS "gameSeasonId";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "parentId";

ALTER TABLE "Category" DROP COLUMN IF EXISTS "gameMode";

ALTER TABLE "Category" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "isActive";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "sortOrder";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "updatedAt";

ALTER TABLE "Category" DROP COLUMN IF EXISTS "gameId";

DROP TABLE IF EXISTS "game_seasons";

DROP TYPE IF EXISTS "CategoryGameMode" CASCADE;
