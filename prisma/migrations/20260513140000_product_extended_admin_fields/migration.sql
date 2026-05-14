-- CreateEnum
CREATE TYPE "MeasureUnit" AS ENUM ('UN', 'KG', 'LT', 'PC', 'CX', 'M', 'M2', 'M3');

-- CreateEnum
CREATE TYPE "ProductOrigin" AS ENUM ('NATIONAL', 'IMPORTED', 'OTHER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
ALTER TABLE "Product" ADD COLUMN "barcode" TEXT;
ALTER TABLE "Product" ADD COLUMN "shortDescription" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Product" ADD COLUMN "longDescriptionRich" TEXT;
ALTER TABLE "Product" ADD COLUMN "costPrice" DECIMAL(12,2);
ALTER TABLE "Product" ADD COLUMN "promoPrice" DECIMAL(12,2);
ALTER TABLE "Product" ADD COLUMN "promoEndsAt" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN "minStockAlert" INTEGER;
ALTER TABLE "Product" ADD COLUMN "weightKg" DECIMAL(12,4);
ALTER TABLE "Product" ADD COLUMN "dimensionLengthCm" DECIMAL(12,2);
ALTER TABLE "Product" ADD COLUMN "dimensionWidthCm" DECIMAL(12,2);
ALTER TABLE "Product" ADD COLUMN "dimensionHeightCm" DECIMAL(12,2);
ALTER TABLE "Product" ADD COLUMN "measureUnit" "MeasureUnit" NOT NULL DEFAULT 'UN';
ALTER TABLE "Product" ADD COLUMN "origin" "ProductOrigin" NOT NULL DEFAULT 'NATIONAL';

UPDATE "Product"
SET "shortDescription" = LEFT("description", 500)
WHERE "shortDescription" = '';

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProductImage" ADD COLUMN "altText" TEXT;
