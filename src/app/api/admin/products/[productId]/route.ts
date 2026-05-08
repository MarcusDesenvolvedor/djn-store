import { adminProductIdParamSchema } from "@/features/product-admin/product-admin.schema";
import { deleteAdminProduct } from "@/features/product-admin/product-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const { productId: rawId } = await context.params;
  const parsedId = adminProductIdParamSchema.safeParse(rawId);
  if (!parsedId.success) {
    const msg = parsedId.error.issues[0]?.message ?? "ID inválido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await deleteAdminProduct(parsedId.data);
  if (!result.ok) {
    const map: Record<typeof result.error, { status: number; message: string }> = {
      NOT_FOUND: { status: 404, message: "Produto não encontrado" },
      HAS_ORDERS: {
        status: 409,
        message: "Não é possível excluir: este produto consta em pedidos.",
      },
      UNKNOWN: { status: 500, message: "Não foi possível excluir o produto" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({ data: { deleted: true } }, { status: 200 });
}
