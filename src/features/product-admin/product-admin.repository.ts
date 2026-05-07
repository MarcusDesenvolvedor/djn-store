import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductAdminListRow = {
  id: string;
  sku: string;
  name: string;
  price: Prisma.Decimal;
  stock: number;
  isActive: boolean;
  updatedAt: Date;
  gameName: string;
  categoryName: string;
};

export async function findCategoriesForGameAdmin(gameId: string): Promise<
  { id: string; name: string; createdAt: Date }[]
> {
  return prisma.category.findMany({
    where: { gameId },
    select: { id: true, name: true, createdAt: true },
    orderBy: { name: "asc" },
  });
}

export async function findGameExists(gameId: string): Promise<boolean> {
  const row = await prisma.game.findUnique({
    where: { id: gameId },
    select: { id: true },
  });
  return row !== null;
}

export async function findCategoryBelongsToGame(categoryId: string, gameId: string): Promise<boolean> {
  const row = await prisma.category.findFirst({
    where: { id: categoryId, gameId },
    select: { id: true },
  });
  return row !== null;
}

export async function insertProduct(input: {
  sku: string;
  gameId: string;
  categoryId: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  brand: string | null;
  isActive: boolean;
}): Promise<ProductAdminListRow> {
  const row = await prisma.product.create({
    data: {
      sku: input.sku,
      gameId: input.gameId,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      brand: input.brand,
      isActive: input.isActive,
    },
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
      updatedAt: true,
      game: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    price: row.price,
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
    gameName: row.game.name,
    categoryName: row.category.name,
  };
}

export async function findProductsForAdminList(limit: number): Promise<ProductAdminListRow[]> {
  const rows = await prisma.product.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
      updatedAt: true,
      game: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    sku: row.sku,
    name: row.name,
    price: row.price,
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt,
    gameName: row.game.name,
    categoryName: row.category.name,
  }));
}
