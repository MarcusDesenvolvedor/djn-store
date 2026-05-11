import { prisma } from "@/lib/prisma";

export type GameListRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function findAllGamesForList(): Promise<GameListRow[]> {
  return prisma.game.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export type StorefrontProductView = {
  id: number;
  name: string;
  description: string;
  priceStr: string;
  stock: number;
  isActive: boolean;
  brand: string | null;
  categoryName: string;
  images: Array<{ id: string; url: string }>;
};

export type StorefrontCategoryRow = {
  id: string;
  name: string;
  imageUrl: string | null;
  activeProductCount: number;
};

export async function findAllCategoriesForStorefront(): Promise<StorefrontCategoryRow[]> {
  const [categories, productCategoryIds] = await prisma.$transaction([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, imageUrl: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { categoryId: true },
    }),
  ]);

  const countMap = new Map<string, number>();
  for (const row of productCategoryIds) {
    countMap.set(row.categoryId, (countMap.get(row.categoryId) ?? 0) + 1);
  }

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    activeProductCount: countMap.get(c.id) ?? 0,
  }));
}

export type StorefrontCategorySearchHitRow = {
  id: string;
  name: string;
};

export type StorefrontProductSearchHitRow = {
  id: number;
  name: string;
  categoryName: string;
};

export async function searchCategoriesForStorefront(nameContains: string, take: number): Promise<
  StorefrontCategorySearchHitRow[]
> {
  return prisma.category.findMany({
    where: {
      name: { contains: nameContains, mode: "insensitive" },
    },
    take,
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function searchActiveProductsForStorefront(
  term: string,
  take: number,
): Promise<StorefrontProductSearchHitRow[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ],
    },
    take,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: { select: { name: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    categoryName: row.category.name,
  }));
}

export async function findProductByIdForStorefront(productId: number): Promise<StorefrontProductView | null> {
  const row = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      stock: true,
      isActive: true,
      brand: true,
      category: { select: { name: true } },
      images: { orderBy: { createdAt: "asc" }, select: { id: true, url: true } },
    },
  });
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceStr: row.price.toString(),
    stock: row.stock,
    isActive: row.isActive,
    brand: row.brand,
    categoryName: row.category.name,
    images: row.images,
  };
}
