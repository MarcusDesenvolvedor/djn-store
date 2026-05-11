import { listStorefrontCategories } from "@/features/catalog/catalog.service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await listStorefrontCategories();
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json(
      { error: "Failed to list categories" },
      { status: 500 },
    );
  }
}
