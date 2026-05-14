import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CategoryAdminRow = {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: Date;
  productCount: number;
};

export type CategoryAdminFlatRow = CategoryAdminRow & {
  parentId: string | null;
  childCount: number;
};

export async function findAllCategoriesFlatForAdmin(): Promise<CategoryAdminFlatRow[]> {
  const rows = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      createdAt: true,
      parentId: true,
      _count: { select: { products: true, children: true } },
    },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt,
    parentId: row.parentId ?? null,
    productCount: row._count.products,
    childCount: row._count.children,
  }));
}

export async function findCategoryExists(categoryId: string): Promise<boolean> {
  const row = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  return row !== null;
}

export async function findCategoryWithDeletionConstraints(
  categoryId: string,
): Promise<{ id: string; productCount: number; childCount: number } | null> {
  const row = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      _count: { select: { products: true, children: true } },
    },
  });
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    productCount: row._count.products,
    childCount: row._count.children,
  };
}

export async function insertCategory(
  name: string,
  imageUrl: string | null,
  parentId: string | null,
): Promise<CategoryAdminRow> {
  const row = await prisma.category.create({
    data: { name, imageUrl, parentId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt,
    productCount: row._count.products,
  };
}

export async function updateCategoryById(
  categoryId: string,
  patch: { name?: string; imageUrl?: string | null },
): Promise<CategoryAdminRow | null> {
  try {
    const row = await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.imageUrl !== undefined ? { imageUrl: patch.imageUrl } : {}),
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        _count: { select: { products: true } },
      },
    });
    return {
      id: row.id,
      name: row.name,
      imageUrl: row.imageUrl,
      createdAt: row.createdAt,
      productCount: row._count.products,
    };
  } catch (error: unknown) {
    if (isPrismaRecordNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export async function deleteCategoryById(categoryId: string): Promise<void> {
  await prisma.category.delete({
    where: { id: categoryId },
  });
}

export function isPrismaRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}
