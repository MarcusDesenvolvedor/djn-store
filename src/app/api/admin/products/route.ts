import { createAdminProductBodySchema } from "@/features/product-admin/product-admin.schema";
import { createAdminProduct, listAdminProducts } from "@/features/product-admin/product-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

function serializeProduct(row: Awaited<ReturnType<typeof listAdminProducts>>[number]) {
  return {
    id: row.id,
    name: row.name,
    price: row.price.toString(),
    stock: row.stock,
    isActive: row.isActive,
    updatedAt: row.updatedAt.toISOString(),
    categoryName: row.categoryName,
    orderItemCount: row.orderItemCount,
    imageCount: row.imageCount,
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
      CATEGORY_NOT_FOUND: { status: 400, message: "Categoria não encontrada" },
      CATEGORY_NOT_LEAF: {
        status: 400,
        message:
          "Escolha uma categoria folha (último nível). Expanda a árvore até um nó sem filhos — nós intermediários não aceitam produto.",
      },
      SKU_DUPLICATE: {
        status: 400,
        message: "Conflito ao gerar SKU do produto — tente novamente; se persistir, contate suporte técnico",
      },
      VARIANT_SKU_DUPLICATE: {
        status: 400,
        message: "Uma ou mais variantes usam SKU já vinculado a outra variante deste produto — ajuste os códigos",
      },
      UNKNOWN: { status: 500, message: "Não foi possível criar o produto" },
    };
    const err = map[result.error];
    return NextResponse.json({ error: err.message }, { status: err.status });
  }

  return NextResponse.json({ data: serializeProduct(result.product) }, { status: 201 });
}
