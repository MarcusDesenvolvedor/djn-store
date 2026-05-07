"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: { prefix: string; title: string; description: string }[] = [
  { prefix: "/admin/produtos", title: "Produtos", description: "Catálogo, estoque e preços por jogo." },
  { prefix: "/admin/categorias", title: "Categorias", description: "Árvore de categorias por título ARPG." },
  {
    prefix: "/admin/configuracoes",
    title: "Configurações",
    description: "Preferências operacionais da loja.",
  },
];

function getHeading(pathname: string): { title: string; description: string } {
  if (pathname === "/admin") {
    return {
      title: "Dashboard",
      description: "Resumo rápido da operação — métricas e atalhos em breve.",
    };
  }
  const hit = ROUTE_TITLES.find((r) => pathname.startsWith(r.prefix));
  if (hit) {
    return { title: hit.title, description: hit.description };
  }
  return { title: "Admin", description: "" };
}

export function AdminTopBar() {
  const pathname = usePathname();
  const { title, description } = getHeading(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-[60px] shrink-0 items-center justify-between gap-6 border-b border-outline-variant bg-background/95 px-8 backdrop-blur-sm">
      <div className="min-w-0">
        <h1 className="truncate font-h3 text-h3 text-on-surface">{title}</h1>
        {description ? (
          <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "ring-1 ring-outline-variant",
            },
          }}
        />
      </div>
    </header>
  );
}
