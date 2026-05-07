import { prisma } from "@/lib/prisma";

export type GameListRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function findAllGamesForList(): Promise<GameListRow[]> {
  return prisma.game.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
