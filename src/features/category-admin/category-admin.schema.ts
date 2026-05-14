import { z } from "zod";

const imageUrlSchema = z.preprocess(
  (val) => {
    if (val === undefined || val === null) return null;
    if (typeof val !== "string") return val;
    const t = val.trim();
    return t === "" ? null : t;
  },
  z.union([z.null(), z.string().url("Informe uma URL válida (http ou https)").max(2000)]),
);

export const createAdminCategoryBodySchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(120),
  imageUrl: imageUrlSchema,
  /** Omit or undefined = root category */
  parentId: z.string().uuid("ID da categoria pai inválido").optional(),
});

export type CreateAdminCategoryBody = z.infer<typeof createAdminCategoryBodySchema>;
export type CreateAdminCategoryInput = z.input<typeof createAdminCategoryBodySchema>;

export const patchAdminCategoryBodySchema = z
  .object({
    name: z.string().trim().min(1, "Nome obrigatório").max(120).optional(),
    imageUrl: imageUrlSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.imageUrl !== undefined, {
    message: "Informe pelo menos nome ou URL da imagem",
  });

export type PatchAdminCategoryBody = z.infer<typeof patchAdminCategoryBodySchema>;
export type PatchAdminCategoryInput = z.input<typeof patchAdminCategoryBodySchema>;

export const adminCategoryIdParamSchema = z.string().uuid("ID de categoria inválido");
