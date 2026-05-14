import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { CreateAdminProductBody } from "./product-admin.schema";
import {
  deleteAdminProductById,
  insertProduct,
  findProductsForAdminList,
  resolveCategoryForProductLeafAssignment,
  type ProductAdminListRow,
} from "./product-admin.repository";

export type { ProductAdminListRow };

function makeFallbackSku(): string {
  const cryptoRef = globalThis.crypto;
  const raw =
    typeof cryptoRef !== "undefined" && "randomUUID" in cryptoRef
      ? cryptoRef.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()
      : `${Date.now()}`;
  return `AUTO-${raw}`;
}

function decimalOrNull(value: number | null | undefined): Prisma.Decimal | null {
  if (value === null || value === undefined) {
    return null;
  }
  return new Prisma.Decimal(value);
}

function classifySkuUniqueViolation(error: PrismaClientKnownRequestError): "PRODUCT" | "VARIANT" | null {
  if (error.code !== "P2002") {
    return null;
  }
  const targetRaw = error.meta?.target;
  const targets = Array.isArray(targetRaw)
    ? targetRaw.map(String)
    : targetRaw != null
      ? [String(targetRaw)]
      : [];
  const fields = targets.map((t) => t.toLowerCase());
  if (fields.includes("productid") && fields.includes("sku")) {
    return "VARIANT";
  }
  if (fields.some((t) => t === "sku")) {
    return "PRODUCT";
  }
  return null;
}

export type CreateAdminProductResult =
  | { ok: true; product: ProductAdminListRow }
  | {
      ok: false;
      error:
        | "CATEGORY_NOT_FOUND"
        | "CATEGORY_NOT_LEAF"
        | "SKU_DUPLICATE"
        | "VARIANT_SKU_DUPLICATE"
        | "UNKNOWN";
    };

export async function createAdminProduct(body: CreateAdminProductBody): Promise<CreateAdminProductResult> {
  const categoryGate = await resolveCategoryForProductLeafAssignment(body.categoryId);
  if (!categoryGate.ok) {
    if (categoryGate.reason === "MISSING") {
      return { ok: false, error: "CATEGORY_NOT_FOUND" };
    }
    return { ok: false, error: "CATEGORY_NOT_LEAF" };
  }

  const sku = makeFallbackSku();
  const resolvedStock =
    body.variants.length > 0 ? body.variants.reduce((sum, v) => sum + v.stock, 0) : body.stock;

  try {
    const product = await insertProduct({
      categoryId: body.categoryId,
      sku,
      name: body.name,
      shortDescription: body.shortDescription,
      description: body.shortDescription,
      longDescriptionRich: body.longDescriptionRich,
      price: new Prisma.Decimal(body.price),
      costPrice: decimalOrNull(body.costPrice),
      promoPrice: decimalOrNull(body.promoPrice),
      promoEndsAt: body.promoEndsAt,
      stock: resolvedStock,
      minStockAlert: body.minStockAlert,
      origin: body.origin,
      brand: body.brand,
      isActive: body.isActive,
      imageAssets: body.imageAssets,
      variants: body.variants.map((v) => ({
        sku: v.sku,
        attributes: v.attributes,
        salePrice: v.salePrice,
        stock: v.stock,
      })),
    });
    return { ok: true, product };
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      const kind = classifySkuUniqueViolation(error);
      if (kind === "VARIANT") {
        return { ok: false, error: "VARIANT_SKU_DUPLICATE" };
      }
      if (kind === "PRODUCT") {
        return { ok: false, error: "SKU_DUPLICATE" };
      }
    }
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
