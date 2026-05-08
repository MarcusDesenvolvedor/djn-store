import { Prisma } from "@prisma/client";
import type { CreateAdminProductBody } from "./product-admin.schema";
import {
  deleteAdminProductById,
  findCategoryExists,
  insertProduct,
  findProductsForAdminList,
  type ProductAdminListRow,
} from "./product-admin.repository";

export type { ProductAdminListRow };

export type CreateAdminProductResult =
  | { ok: true; product: ProductAdminListRow }
  | { ok: false; error: "CATEGORY_NOT_FOUND" | "UNKNOWN" };

export async function createAdminProduct(body: CreateAdminProductBody): Promise<CreateAdminProductResult> {
  const categoryOk = await findCategoryExists(body.categoryId);
  if (!categoryOk) {
    return { ok: false, error: "CATEGORY_NOT_FOUND" };
  }

  try {
    const product = await insertProduct({
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      price: new Prisma.Decimal(body.price),
      stock: body.stock,
      brand: body.brand,
      isActive: body.isActive,
      imageUrls: body.imageUrls,
    });
    return { ok: true, product };
  } catch {
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function listAdminProducts(limit = 100): Promise<ProductAdminListRow[]> {
  return findProductsForAdminList(limit);
}

export type DeleteAdminProductResult =
  | { ok: true }
  | { ok: false; error: "NOT_FOUND" | "HAS_ORDERS" | "UNKNOWN" };

export async function deleteAdminProduct(productId: number): Promise<DeleteAdminProductResult> {
  try {
    const result = await deleteAdminProductById(productId);
    if (result === "NOT_FOUND") {
      return { ok: false, error: "NOT_FOUND" };
    }
    if (result === "HAS_ORDERS") {
      return { ok: false, error: "HAS_ORDERS" };
    }
    return { ok: true };
  } catch (error: unknown) {
    console.error("[product-admin] deleteAdminProduct failed", error);
    return { ok: false, error: "UNKNOWN" };
  }
}
