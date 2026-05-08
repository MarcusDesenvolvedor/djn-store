import { listGames } from "@/features/catalog/catalog.service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const games = await listGames();
    return NextResponse.json({ data: games });
  } catch {
    return NextResponse.json(
      { error: "Failed to list games" },
      { status: 500 },
    );
  }
}
