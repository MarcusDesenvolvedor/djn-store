import { adminCategoriesQuerySchema } from "@/features/product-admin/product-admin.schema";
import { listAdminCategoriesByGame } from "@/features/product-admin/product-admin.service";
import { requireAdminApiSession } from "@/features/admin/admin-access.service";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const gate = await requireAdminApiSession();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: gate.status });
  }

  const url = new URL(request.url);
  const raw = { gameId: url.searchParams.get("gameId") ?? "" };
  const parsed = adminCategoriesQuerySchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "gameId inválido";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const result = await listAdminCategoriesByGame(parsed.data.gameId);
  if (!result.ok) {
    return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
  }

  const data = result.categories.map((c) => ({
    id: c.id,
    name: c.name,
    createdAt: c.createdAt.toISOString(),
  }));

  return NextResponse.json({ data });
}
