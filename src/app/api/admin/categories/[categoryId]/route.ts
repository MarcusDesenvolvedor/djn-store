import {
  adminCategoryIdParamSchema,
  patchAdminCategoryBodySchema,
} from "@/features/category-admin/category-admin.schema";
import { deleteAdminCategory, updateAdminCategory } from "@/features/category-admin/category-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
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

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchAdminCategoryBodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await updateAdminCategory(parsedId.data, parsed.data);
  if (!result.ok) {
    const map: Record<typeof result.error, { status: number; message: string }> = {
      NOT_FOUND: { status: 404, message: "Categoria não encontrada" },
      UNKNOWN: { status: 500, message: "Não foi possível atualizar a categoria" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({
    data: {
      id: result.category.id,
      name: result.category.name,
      imageUrl: result.category.imageUrl,
      createdAt: result.category.createdAt.toISOString(),
      productCount: result.category.productCount,
    },
  });
}

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
      HAS_CHILDREN: {
        status: 409,
        message:
          "Não é possível excluir: existem subcategorias vinculadas. Remova ou mova as subcategorias antes.",
      },
      UNKNOWN: { status: 500, message: "Não foi possível excluir a categoria" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({ data: { deleted: true } }, { status: 200 });
}
