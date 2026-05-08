import { z } from "zod";

export const createAdminCategoryBodySchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(120),
  imageUrl: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return null;
      if (typeof val !== "string") return val;
      const t = val.trim();
      return t === "" ? null : t;
    },
    z.union([z.null(), z.string().url("Informe uma URL válida (http ou https)").max(2000)]),
  ),
});
export type CreateAdminCategoryBody = z.infer<typeof createAdminCategoryBodySchema>;
export type CreateAdminCategoryInput = z.input<typeof createAdminCategoryBodySchema>;

export const adminCategoryIdParamSchema = z.string().uuid("ID de categoria inválido");
