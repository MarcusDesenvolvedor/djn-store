import { z } from "zod";

export const createAdminProductBodySchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria").uuid("Categoria inválida"),
  name: z.string().trim().min(1, "Nome obrigatório").max(200),
  description: z.string().trim().min(1, "Descrição obrigatória").max(8000),
  price: z.number().positive("Preço deve ser maior que zero").finite(),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  brand: z
    .union([z.string().trim().max(120), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  isActive: z.boolean(),
  imageUrls: z
    .array(z.object({ url: z.string() }))
    .default([])
    .transform((items) => items.map((i) => i.url.trim()).filter(Boolean))
    .pipe(
      z
        .array(z.string().url("Cada imagem deve ser uma URL http(s) válida").max(2000))
        .max(32, "No máximo 32 imagens por produto"),
    ),
});

export type CreateAdminProductBody = z.infer<typeof createAdminProductBodySchema>;
export type CreateAdminProductInput = z.input<typeof createAdminProductBodySchema>;

/** Valores do formulário admin (react-hook-form + useFieldArray); alinhado ao schema parseado. */
export type CreateAdminProductFormValues = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  isActive: boolean;
  imageUrls: { url: string }[];
};

export const adminProductIdParamSchema = z.coerce.number().int().positive("ID de produto inválido");
