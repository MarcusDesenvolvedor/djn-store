import { z } from "zod";

export const createAdminProductBodySchema = z.object({
  sku: z.string().trim().min(1, "SKU obrigatório").max(64),
  gameId: z.string().uuid("Jogo inválido"),
  categoryId: z.string().uuid("Categoria inválida"),
  name: z.string().trim().min(1, "Nome obrigatório").max(200),
  description: z.string().trim().min(1, "Descrição obrigatória").max(8000),
  price: z.number().positive("Preço deve ser maior que zero").finite(),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  brand: z
    .union([z.string().trim().max(120), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  isActive: z.boolean(),
});

export type CreateAdminProductBody = z.infer<typeof createAdminProductBodySchema>;

export const adminCategoriesQuerySchema = z.object({
  gameId: z.string().uuid("gameId inválido"),
});
