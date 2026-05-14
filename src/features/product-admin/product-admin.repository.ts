import { type ProductOrigin, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductAdminListRow = {
  id: number;
  name: string;
  price: Prisma.Decimal;
  stock: number;
  isActive: boolean;
  updatedAt: Date;
  categoryName: string;
  orderItemCount: number;
  imageCount: number;
};

export async function resolveCategoryForProductLeafAssignment(
  categoryId: string,
): Promise<{ ok: true } | { ok: false; reason: "MISSING" | "HAS_CHILDREN" }> {
  const row = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      _count: { select: { children: true } },
    },
  });
  if (!row) {
    return { ok: false, reason: "MISSING" };
  }
  if (row._count.children > 0) {
    return { ok: false, reason: "HAS_CHILDREN" };
  }
  return { ok: true };
}

export type InsertProductVariantRow = {
  sku: string | null;
  attributes: Record<string, string>;
  salePrice: number | null;
  stock: number;
};

export async function insertProduct(input: {
  categoryId: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  longDescriptionRich: string | null;
  price: Prisma.Decimal;
  costPrice: Prisma.Decimal | null;
  promoPrice: Prisma.Decimal | null;
  promoEndsAt: Date | null;
  stock: number;
  minStockAlert: number | null;
  origin: ProductOrigin;
  brand: string | null;
  isActive: boolean;
  imageAssets: { url: string; altText: string | null; isPrimary: boolean }[];
  variants: InsertProductVariantRow[];
}): Promise<ProductAdminListRow> {
  const sortedImages = [...input.imageAssets].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
  );

  const row = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        categoryId: input.categoryId,
        sku: input.sku,
        barcode: null,
        name: input.name,
        shortDescription: input.shortDescription,
        description: input.description,
        longDescriptionRich: input.longDescriptionRich,
        price: input.price,
        costPrice: input.costPrice,
        promoPrice: input.promoPrice,
        promoEndsAt: input.promoEndsAt,
        stock: input.stock,
        minStockAlert: input.minStockAlert,
        weightKg: null,
        dimensionLengthCm: null,
        dimensionWidthCm: null,
        dimensionHeightCm: null,
        origin: input.origin,
        brand: input.brand,
        isActive: input.isActive,
        ...(sortedImages.length > 0
          ? {
              images: {
                create: sortedImages.map((img) => ({
                  url: img.url,
                  altText: img.altText,
                  isPrimary: img.isPrimary,
                })),
              },
            }
          : {}),
      },
      select: { id: true },
    });

    if (input.variants.length > 0) {
      await tx.productVariant.createMany({
        data: input.variants.map((v) => ({
          productId: created.id,
          sku: v.sku,
          attributes: v.attributes as Prisma.InputJsonValue,
          salePrice:
            v.salePrice === null || v.salePrice === undefined
              ? null
              : new Prisma.Decimal(v.salePrice),
          stock: v.stock,
        })),
      });
    }

    return tx.product.findUniqueOrThrow({
      where: { id: created.id },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        updatedAt: true,
        category: { select: { name: true } },
        _count: { select: { orderItems: true, images: true } },
      },
    });
  });

  return {
    id: row.id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
    categoryName: row.category.name,
    orderItemCount: row._count.orderItems,
    imageCount: row._count.images,
  };
}

export async function findProductsForAdminList(limit: number): Promise<ProductAdminListRow[]> {
  const rows = await prisma.product.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
      updatedAt: true,
      category: { select: { name: true } },
      _count: { select: { orderItems: true, images: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    stock: r.stock,
    isActive: r.isActive,
    updatedAt: r.updatedAt,
    categoryName: r.category.name,
    orderItemCount: r._count.orderItems,
    imageCount: r._count.images,
  }));
}

export async function deleteAdminProductById(
  productId: number,
): Promise<"DELETED" | "NOT_FOUND" | "HAS_ORDERS"> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      _count: { select: { orderItems: true } },
    },
  });
  if (!product) {
    return "NOT_FOUND";
  }
  if (product._count.orderItems > 0) {
    return "HAS_ORDERS";
  }
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId } }),
    prisma.product.delete({ where: { id: productId } }),
  ]);
  return "DELETED";
}
