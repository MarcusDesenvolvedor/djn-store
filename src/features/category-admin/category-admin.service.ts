import type {
  CategoryAdminFlatSerializable,
  CategoryAdminTreeSerializable,
} from "./category-admin.types";
import type { CreateAdminCategoryBody, PatchAdminCategoryBody } from "./category-admin.schema";
import {
  deleteCategoryById,
  findAllCategoriesFlatForAdmin,
  findCategoryExists,
  findCategoryWithDeletionConstraints,
  insertCategory,
  isPrismaRecordNotFound,
  updateCategoryById,
  type CategoryAdminFlatRow,
  type CategoryAdminRow,
} from "./category-admin.repository";

export type { CategoryAdminFlatRow, CategoryAdminRow };

export type CategoryAdminTreeNode = CategoryAdminFlatRow & {
  children: CategoryAdminTreeNode[];
};

export type CreateAdminCategoryResult =
  | { ok: true; category: CategoryAdminRow }
  | { ok: false; error: "PARENT_NOT_FOUND" | "UNKNOWN" };

export type UpdateAdminCategoryResult =
  | { ok: true; category: CategoryAdminRow }
  | { ok: false; error: "NOT_FOUND" | "UNKNOWN" };

export type DeleteAdminCategoryResult =
  | { ok: true }
  | { ok: false; error: "NOT_FOUND" | "HAS_PRODUCTS" | "HAS_CHILDREN" | "UNKNOWN" };

function buildCategoryAdminTreeFromFlat(flat: CategoryAdminFlatRow[]): CategoryAdminTreeNode[] {
  const byId = new Map<string, CategoryAdminTreeNode>();
  for (const row of flat) {
    byId.set(row.id, {
      ...row,
      children: [],
    });
  }
  const roots: CategoryAdminTreeNode[] = [];
  for (const row of flat) {
    const node = byId.get(row.id);
    if (!node) {
      continue;
    }
    if (row.parentId === null) {
      roots.push(node);
      continue;
    }
    const parent = byId.get(row.parentId);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortKey = (a: CategoryAdminTreeNode, b: CategoryAdminTreeNode) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  function sortRec(node: CategoryAdminTreeNode): void {
    node.children.sort(sortKey);
    for (const c of node.children) sortRec(c);
  }
  roots.sort(sortKey);
  for (const r of roots) sortRec(r);
  return roots;
}

function serializeCategoryAdminTree(nodes: CategoryAdminTreeNode[]): CategoryAdminTreeSerializable[] {
  return nodes.map((n) => ({
    id: n.id,
    name: n.name,
    imageUrl: n.imageUrl,
    createdAt: n.createdAt.toISOString(),
    productCount: n.productCount,
    childCount: n.childCount,
    children: serializeCategoryAdminTree(n.children),
  }));
}

export async function listCategoryAdminTreeForAdmin(): Promise<CategoryAdminTreeSerializable[]> {
  const flat = await findAllCategoriesFlatForAdmin();
  const tree = buildCategoryAdminTreeFromFlat(flat);
  return serializeCategoryAdminTree(tree);
}

export async function listCategoryAdminFlatForAdmin(): Promise<CategoryAdminFlatSerializable[]> {
  const rows = await findAllCategoriesFlatForAdmin();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
    createdAt: r.createdAt.toISOString(),
    parentId: r.parentId,
    productCount: r.productCount,
    childCount: r.childCount,
  }));
}

export async function createAdminCategory(body: CreateAdminCategoryBody): Promise<CreateAdminCategoryResult> {
  const parentId = body.parentId ?? null;
  try {
    if (parentId) {
      const exists = await findCategoryExists(parentId);
      if (!exists) {
        return { ok: false, error: "PARENT_NOT_FOUND" };
      }
    }
    const category = await insertCategory(body.name.trim(), body.imageUrl, parentId);
    return { ok: true, category };
  } catch (error: unknown) {
    console.error("[category-admin] createAdminCategory failed", error);
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function updateAdminCategory(
  categoryId: string,
  body: PatchAdminCategoryBody,
): Promise<UpdateAdminCategoryResult> {
  const patch: { name?: string; imageUrl?: string | null } = {};
  if (body.name !== undefined) {
    patch.name = body.name.trim();
  }
  if (body.imageUrl !== undefined) {
    patch.imageUrl = body.imageUrl;
  }
  try {
    const category = await updateCategoryById(categoryId, patch);
    if (!category) {
      return { ok: false, error: "NOT_FOUND" };
    }
    return { ok: true, category };
  } catch (error: unknown) {
    console.error("[category-admin] updateAdminCategory failed", error);
    return { ok: false, error: "UNKNOWN" };
  }
}

export async function deleteAdminCategory(categoryId: string): Promise<DeleteAdminCategoryResult> {
  const category = await findCategoryWithDeletionConstraints(categoryId);
  if (!category) {
    return { ok: false, error: "NOT_FOUND" };
  }
  if (category.productCount > 0) {
    return { ok: false, error: "HAS_PRODUCTS" };
  }
  if (category.childCount > 0) {
    return { ok: false, error: "HAS_CHILDREN" };
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
