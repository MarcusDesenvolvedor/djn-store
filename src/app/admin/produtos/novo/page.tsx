import type { Metadata } from "next";
import { ProductCreateForm } from "@/components/admin/product-create-form";
import { listGames } from "@/features/catalog/catalog.service";

export const metadata: Metadata = {
  title: "Novo produto",
};

export default async function AdminNovoProdutoPage() {
  const games = await listGames();

  return (
    <div className="mx-auto max-w-3xl pb-8">
      <ProductCreateForm games={games.map((g) => ({ id: g.id, name: g.name }))} />
    </div>
  );
}
