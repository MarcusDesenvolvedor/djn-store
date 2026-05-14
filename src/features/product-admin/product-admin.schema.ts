import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

export const PRODUCT_ORIGIN_VALUES = ["NATIONAL", "IMPORTED", "OTHER"] as const;

export type ProductOriginValue = (typeof PRODUCT_ORIGIN_VALUES)[number];

const variantSkuOptional = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const t = value.trim();
  return t.length === 0 ? null : t.slice(0, 80);
}, z.union([z.string().max(80), z.null()]));

const optionalNonNegDecimal = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.union([z.number().nonnegative().finite(), z.null()]),
);

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.union([z.number().int().nonnegative(), z.null()]),
);

const promoEndsParser = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}, z.union([z.date(), z.null()]));

const variantAttributesSchema = z
  .record(z.string().trim().max(40), z.string().trim().max(120))
  .superRefine((obj, ctx) => {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe ao menos um atributo ou rótulo da combinação",
      });
      return;
    }
    if (keys.length > 24) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No máximo 24 chaves em atributos por variante",
      });
    }
  });

export const adminProductVariantCreateSchema = z.object({
  sku: variantSkuOptional,
  attributes: variantAttributesSchema,
  salePrice: optionalNonNegDecimal,
  stock: z.number().int().min(0, "Estoque da variante não pode ser negativo"),
});

export type AdminProductVariantCreateBody = z.infer<typeof adminProductVariantCreateSchema>;

const imageAssetInputSchema = z
  .array(
    z.object({
      url: z.string(),
      altText: z
        .union([z.string(), z.literal("")])
        .optional()
        .transform((value) => {
          const t = (value ?? "").trim();
          return t.length === 0 ? null : t.slice(0, 200);
        }),
      isPrimary: z.boolean().optional(),
    }),
  )
  .default([])
  .transform((items) => {
    const normalized = items
      .map((row) => ({
        url: row.url.trim(),
        altText: row.altText ?? null,
        isPrimary: row.isPrimary ?? false,
      }))
      .filter((row) => row.url.length > 0);
    if (normalized.length === 0) {
      return [];
    }
    const primaryIdx = normalized.findIndex((row) => row.isPrimary);
    const idx = primaryIdx >= 0 ? primaryIdx : 0;
    return normalized.map((row, i) => ({
      url: row.url,
      altText: row.altText,
      isPrimary: i === idx,
    }));
  })
  .pipe(
    z
      .array(
        z.object({
          url: z.string().url("Cada imagem deve ser uma URL http(s) válida").max(2000),
          altText: z.string().max(200).nullable(),
          isPrimary: z.boolean(),
        }),
      )
      .max(32, "No máximo 32 imagens por produto"),
  );

export const createAdminProductBodySchema = z
  .object({
    categoryId: z.string().min(1, "Selecione uma categoria").uuid("Categoria inválida"),
    name: z.string().trim().min(1, "Nome obrigatório").max(200),
    shortDescription: z.string().trim().min(1, "Descrição curta obrigatória").max(2000),
    longDescriptionRich: z
      .union([z.string(), z.null(), z.literal("")])
      .optional()
      .transform((raw) => {
        if (raw === undefined || raw === null) {
          return null;
        }
        const t = typeof raw === "string" ? raw.trim() : "";
        if (t.length === 0) {
          return null;
        }
        const sanitized = DOMPurify.sanitize(t, { USE_PROFILES: { html: true } });
        if (sanitized.length > 200_000) {
          return null;
        }
        return sanitized.trim().length === 0 ? null : sanitized;
      }),
    price: z.number().positive("Preço de venda deve ser maior que zero").finite(),
    costPrice: optionalNonNegDecimal,
    promoPrice: optionalNonNegDecimal,
    promoEndsAt: promoEndsParser,
    stock: z.number().int().min(0, "Estoque não pode ser negativo"),
    minStockAlert: optionalPositiveInt,
    origin: z.enum(PRODUCT_ORIGIN_VALUES),
    brand: z
      .union([z.string().trim().max(120), z.literal(""), z.null()])
      .optional()
      .transform((value) => (value === "" || value === undefined ? null : value)),
    isActive: z.boolean(),
    imageAssets: imageAssetInputSchema,
    variants: z.array(adminProductVariantCreateSchema).max(64).default([]),
  })
  .superRefine((data, ctx) => {
    if (
      data.promoPrice !== null &&
      data.promoPrice > 0 &&
      data.promoPrice >= Number(data.price)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["promoPrice"],
        message: "Preço promocional deve ser menor que o preço de venda",
      });
    }

    const skuSeen = new Set<string>();
    for (let i = 0; i < data.variants.length; i++) {
      const row = data.variants[i];
      if (!row) {
        continue;
      }
      const sku = row.sku;
      if (sku === null) {
        continue;
      }
      if (skuSeen.has(sku)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", i, "sku"],
          message: "SKU repetido entre variantes",
        });
      }
      skuSeen.add(sku);
    }
  });

export type CreateAdminProductBody = z.infer<typeof createAdminProductBodySchema>;
export type CreateAdminProductInput = z.input<typeof createAdminProductBodySchema>;

export type CreateAdminProductImageAsset = CreateAdminProductBody["imageAssets"][number];

/** Linhas da grade de variantes no formulário admin (antes do mapeamento para `attributes`). */
export type AdminProductVariantFormRow = {
  tempId: string;
  combination: string;
  sku: string;
  salePrice: number | null;
  stock: number;
};

/** Formulário admin — promoEndsAt como string (datetime-local) até serializar no submit. */
export type CreateAdminProductFormValues = {
  categoryId: string;
  name: string;
  shortDescription: string;
  longDescriptionRich: string;
  price: number;
  costPrice: number | null;
  promoPrice: number | null;
  promoEndsAt: string;
  stock: number;
  minStockAlert: number | null;
  origin: ProductOriginValue;
  brand: string;
  isActive: boolean;
};

export const adminProductIdParamSchema = z.coerce.number().int().positive("ID de produto inválido");
