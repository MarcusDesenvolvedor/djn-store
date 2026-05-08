-- Product: numeric serial id, no direct gameId; remove SKU if present; FKs from OrderItem/ProductImage use INTEGER.

ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE "ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_productId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_gameId_fkey";
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";

DELETE FROM "OrderItem";
DELETE FROM "ProductImage";
DELETE FROM "Product";

DROP TABLE IF EXISTS "Product";

CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "brand" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" DROP COLUMN "productId";
ALTER TABLE "OrderItem" ADD COLUMN "productId" INTEGER NOT NULL;

ALTER TABLE "ProductImage" DROP COLUMN "productId";
ALTER TABLE "ProductImage" ADD COLUMN "productId" INTEGER NOT NULL;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
