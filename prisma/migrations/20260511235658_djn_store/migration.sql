-- DropIndex
DROP INDEX "Category_gameId_idx";

-- DropIndex
DROP INDEX "Category_gameSeasonId_idx";

-- DropIndex
DROP INDEX "Category_parentId_idx";

-- DropIndex
DROP INDEX "game_seasons_gameId_idx";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updatedAt" DROP DEFAULT;
