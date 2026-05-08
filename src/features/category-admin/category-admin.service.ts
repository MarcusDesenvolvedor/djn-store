import type { CreateAdminCategoryBody } from "./category-admin.schema";
import {
  deleteCategoryById,
  findAllCategoriesForAdmin,
  findCategoryWithProductCount,
  insertCategory,
  isPrismaRecordNotFound,
  type CategoryAdminRow,
} from "./category-admin.repository";

export type { CategoryAdminRow };

export type CreateAdminCategoryResult =
  | { ok: true; category: CategoryAdminRow }
  | { ok: false; error: "UNKNOWN" };

export type DeleteAdminCategoryResult =
  | { ok: true }
  | { ok: false; error: "NOT_FOUND" | "HAS_PRODUCTS" | "UNKNOWN" };

export async function createAdminCategory(body: CreateAdminCategoryBody): Promise<CreateAdminCategoryResult> {
  try {
    const category = await insertCategory(body.name.trim(), body.imageUrl);
    return { ok: true, category };
  } catch (error: unknown) {
    console.error("[category-admin] createAdminCategory failed", error);
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function listCategoriesForAdmin(): Promise<CategoryAdminRow[]> {
  return findAllCategoriesForAdmin();
}

export async function deleteAdminCategory(categoryId: string): Promise<DeleteAdminCategoryResult> {
  const category = await findCategoryWithProductCount(categoryId);
  if (!category) {
    return { ok: false, error: "NOT_FOUND" };
  }
  if (category.productCount > 0) {
    return { ok: false, error: "HAS_PRODUCTS" };
  }

  try {
    await deleteCategoryById(categoryId);
    return { ok: true };
  } catch (error: unknown) {
    if (isPrismaRecordNotFound(error)) {
      return { ok: false, error: "NOT_FOUND" };
    }
    console.error("[category-admin] deleteAdminCategory failed", error);
    return { ok: false, error: "UNKNOWN" };
  }
}
