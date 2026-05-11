import type { Metadata } from "next";
import { VaultArpgHome } from "@/components/store/vault-arpg-home";
import { listStorefrontCategories } from "@/features/catalog/catalog.service";

/** Always read fresh catalog from DB (avoid stale OG static bake at build time). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VAULT.ARPG - Premium Virtual Assets",
  description:
    "Mercado premium global de ativos virtuais para ARPG — segurança, velocidade e estética minimalista.",
};

export default async function Home() {
  const categories = await listStorefrontCategories();
  return <VaultArpgHome categories={categories} />;
}
