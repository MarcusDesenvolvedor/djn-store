import { Prisma } from "@prisma/client";
import type { CreateAdminProductBody } from "./product-admin.schema";
import {
  findCategoryBelongsToGame,
  findCategoriesForGameAdmin,
  findGameExists,
  insertProduct,
  findProductsForAdminList,
  type ProductAdminListRow,
} from "./product-admin.repository";

export type { ProductAdminListRow };

export type CreateAdminProductResult =
  | { ok: true; product: ProductAdminListRow }
  | { ok: false; error: "GAME_NOT_FOUND" | "CATEGORY_INVALID" | "SKU_ALREADY_EXISTS" | "UNKNOWN" };

export async function createAdminProduct(body: CreateAdminProductBody): Promise<CreateAdminProductResult> {
  const gameOk = await findGameExists(body.gameId);
  if (!gameOk) {
    return { ok: false, error: "GAME_NOT_FOUND" };
  }

  const categoryOk = await findCategoryBelongsToGame(body.categoryId, body.gameId);
  if (!categoryOk) {
    return { ok: false, error: "CATEGORY_INVALID" };
  }

  try {
    const product = await insertProduct({
      sku: body.sku.trim().toUpperCase(),
      gameId: body.gameId,
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      price: new Prisma.Decimal(body.price),
      stock: body.stock,
      brand: body.brand,
      isActive: body.isActive,
    });
    return { ok: true, product };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "SKU_ALREADY_EXISTS" };
    }
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function listAdminProducts(limit = 100): Promise<ProductAdminListRow[]> {
  return findProductsForAdminList(limit);
}

export type ListAdminCategoriesResult =
  | { ok: true; categories: Awaited<ReturnType<typeof findCategoriesForGameAdmin>> }
  | { ok: false; error: "GAME_NOT_FOUND" };

export async function listAdminCategoriesByGame(gameId: string): Promise<ListAdminCategoriesResult> {
  const gameOk = await findGameExists(gameId);
  if (!gameOk) {
    return { ok: false, error: "GAME_NOT_FOUND" };
  }
  const categories = await findCategoriesForGameAdmin(gameId);
  return { ok: true, categories };
}
