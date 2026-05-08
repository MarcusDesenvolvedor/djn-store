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
