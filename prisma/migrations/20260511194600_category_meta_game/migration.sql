-- CreateEnum
CREATE TYPE "CategoryGameMode" AS ENUM ('SOFTCORE', 'HARDCORE', 'LADDER', 'NON_LADDER');

-- CreateTable
CREATE TABLE "game_seasons" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_seasons_pkey" PRIMARY KEY ("id")
);

-- AlterTable Category — restabelece vínculo com Game e metadados de catálogo
ALTER TABLE "Category" ADD COLUMN     "gameId" TEXT,
ADD COLUMN "parentId" TEXT,
ADD COLUMN "gameSeasonId" TEXT,
ADD COLUMN "gameMode" "CategoryGameMode",
ADD COLUMN "slug" TEXT,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Garantir ao menos um jogo para backfill FK
INSERT INTO "Game" ("id", "name", "slug", "createdAt", "updatedAt")
SELECT gen_random_uuid()::TEXT, 'Catálogo geral', 'catalog', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "Game" LIMIT 1);

UPDATE "Category"
SET "gameId" = (SELECT id FROM "Game" ORDER BY "createdAt" ASC LIMIT 1)
WHERE "gameId" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "gameId" SET NOT NULL;

-- Slug legível suficientemente único até o admin revisar URLs
UPDATE "Category" SET "slug" = 'cat-' || replace("id"::TEXT, '-', '');

ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Category_gameId_slug_key" ON "Category"("gameId", "slug");

CREATE UNIQUE INDEX "game_seasons_gameId_slug_key" ON "game_seasons"("gameId", "slug");

CREATE INDEX "Category_gameId_idx" ON "Category"("gameId");
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "Category_gameSeasonId_idx" ON "Category"("gameSeasonId");

CREATE INDEX "game_seasons_gameId_idx" ON "game_seasons"("gameId");

ALTER TABLE "game_seasons"
ADD CONSTRAINT "game_seasons_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Category"
ADD CONSTRAINT "Category_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Category"
ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Category"
ADD CONSTRAINT "Category_gameSeasonId_fkey" FOREIGN KEY ("gameSeasonId") REFERENCES "game_seasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
