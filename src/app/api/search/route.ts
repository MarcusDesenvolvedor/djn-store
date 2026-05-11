import { storefrontSearchQuerySchema } from "@/features/catalog/catalog.schema";
import { searchStorefront } from "@/features/catalog/catalog.service";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = storefrontSearchQuerySchema.safeParse({
      q: searchParams.get("q") ?? "",
    });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues.at(0);
      const message = firstIssue?.message ?? "Consulta inválida";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const result = await searchStorefront(parsed.data.q);
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
