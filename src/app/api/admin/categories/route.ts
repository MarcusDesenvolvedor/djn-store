import { createAdminCategoryBodySchema } from "@/features/category-admin/category-admin.schema";
import {
  createAdminCategory,
  listCategoryAdminFlatForAdmin,
  listCategoryAdminTreeForAdmin,
} from "@/features/category-admin/category-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  try {
    const flatRequested = request.nextUrl.searchParams.get("flat") === "1";
    if (flatRequested) {
      const rows = await listCategoryAdminFlatForAdmin();
      return NextResponse.json({ data: rows });
    }
    const tree = await listCategoryAdminTreeForAdmin();
    return NextResponse.json({ data: tree });
  } catch {
    return NextResponse.json({ error: "Failed to list categories" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAdminCategoryBodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await createAdminCategory(parsed.data);
  if (!result.ok) {
    if (result.error === "PARENT_NOT_FOUND") {
      return NextResponse.json({ error: "Categoria pai não encontrada." }, { status: 400 });
    }
    return NextResponse.json({ error: "Não foi possível criar a categoria" }, { status: 500 });
  }

  return NextResponse.json(
    {
      data: {
        id: result.category.id,
        name: result.category.name,
        imageUrl: result.category.imageUrl,
        createdAt: result.category.createdAt.toISOString(),
        productCount: result.category.productCount,
        parentId: parsed.data.parentId ?? null,
      },
    },
    { status: 201 },
  );
}
