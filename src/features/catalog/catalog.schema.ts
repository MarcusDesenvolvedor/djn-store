import { z } from "zod";

/** Query string validation for storefront search (GET /api/search). */
export const storefrontSearchQuerySchema = z.object({
  q: z.string().trim().min(1, "Consulta obrigatória").max(120),
});
