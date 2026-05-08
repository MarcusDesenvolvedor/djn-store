import { Prisma } from "@prisma/client";
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

export async function findCategoryExists(categoryId: string): Promise<boolean> {
  const row = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  return row !== null;
}

export async function insertProduct(input: {
  categoryId: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  brand: string | null;
  isActive: boolean;
  imageUrls: string[];
}): Promise<ProductAdminListRow> {
  const row = await prisma.product.create({
    data: {
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      brand: input.brand,
      isActive: input.isActive,
      ...(input.imageUrls.length > 0
        ? {
            images: {
              create: input.imageUrls.map((url) => ({ url })),
            },
          }
        : {}),
    },
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

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
    categoryName: row.category.name,
    orderItemCount: row._count.orderItems,
    imageCount: row._count.images,
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
