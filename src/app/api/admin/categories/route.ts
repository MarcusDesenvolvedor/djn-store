import { createAdminCategoryBodySchema } from "@/features/category-admin/category-admin.schema";
import { createAdminCategory, listCategoriesForAdmin } from "@/features/category-admin/category-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  try {
    const categories = await listCategoriesForAdmin();
    const data = categories.map((c) => ({
      id: c.id,
      name: c.name,
      imageUrl: c.imageUrl,
      createdAt: c.createdAt.toISOString(),
      productCount: c.productCount,
    }));
    return NextResponse.json({ data });
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
      },    },
    { status: 201 },
  );
}
