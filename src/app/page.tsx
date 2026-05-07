import type { Metadata } from "next";
import { VaultArpgHome } from "@/components/store/vault-arpg-home";

export const metadata: Metadata = {
  title: "VAULT.ARPG - Premium Virtual Assets",
  description:
    "Mercado premium global de ativos virtuais para ARPG — segurança, velocidade e estética minimalista.",
};

export default function Home() {
  return <VaultArpgHome />;
}
