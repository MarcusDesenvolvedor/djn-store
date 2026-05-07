import { createAdminProductBodySchema } from "@/features/product-admin/product-admin.schema";
import { createAdminProduct, listAdminProducts } from "@/features/product-admin/product-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

function serializeProduct(row: Awaited<ReturnType<typeof listAdminProducts>>[number]) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    price: row.price.toString(),
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt.toISOString(),
    gameName: row.gameName,
    categoryName: row.categoryName,
  };
}

export async function GET(): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  try {
    const products = await listAdminProducts(100);
    return NextResponse.json({ data: products.map(serializeProduct) });
  } catch {
    return NextResponse.json({ error: "Failed to list products" }, { status: 500 });
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

  const parsed = createAdminProductBodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid payload";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await createAdminProduct(parsed.data);
  if (!result.ok) {
    const map: Record<typeof result.error, { status: number; message: string }> = {
      GAME_NOT_FOUND: { status: 400, message: "Jogo não encontrado" },
      CATEGORY_INVALID: { status: 400, message: "Categoria não pertence ao jogo selecionado" },
      SKU_ALREADY_EXISTS: { status: 409, message: "SKU já cadastrado" },
      UNKNOWN: { status: 500, message: "Não foi possível criar o produto" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({ data: serializeProduct(result.product) }, { status: 201 });
}
