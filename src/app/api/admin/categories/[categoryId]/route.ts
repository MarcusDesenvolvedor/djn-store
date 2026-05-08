import { adminCategoryIdParamSchema } from "@/features/category-admin/category-admin.schema";
import { deleteAdminCategory } from "@/features/category-admin/category-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const { categoryId: rawId } = await context.params;
  const parsedId = adminCategoryIdParamSchema.safeParse(rawId);
  if (!parsedId.success) {
    const msg = parsedId.error.issues[0]?.message ?? "ID inválido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await deleteAdminCategory(parsedId.data);
  if (!result.ok) {
    const map: Record<typeof result.error, { status: number; message: string }> = {
      NOT_FOUND: { status: 404, message: "Categoria não encontrada" },
      HAS_PRODUCTS: {
        status: 409,
        message: "Não é possível excluir: existem produtos vinculados a esta categoria.",
      },
      UNKNOWN: { status: 500, message: "Não foi possível excluir a categoria" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({ data: { deleted: true } }, { status: 200 });
}
