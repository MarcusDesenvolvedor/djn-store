import { z } from "zod";

export const adminOrderIdParamSchema = z.string().uuid("ID de pedido inválido");
