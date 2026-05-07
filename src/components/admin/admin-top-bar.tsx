"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: { prefix: string; title: string; description: string }[] = [
  { prefix: "/admin/produtos/novo", title: "Novo produto", description: "Cadastro com SKU, jogo e categoria validados na API." },
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

export type AdminTopBarProps = {
  sessionEmail: string | null;
  openAdminAccess: boolean;
};

export function AdminTopBar({ sessionEmail, openAdminAccess }: AdminTopBarProps) {
  const pathname = usePathname();
  const { title, description } = getHeading(pathname);

  return (
    <header className="sticky top-0 z-40 flex flex-col border-b border-outline-variant bg-background/95 backdrop-blur-sm">
      {openAdminAccess ? (
        <div className="border-b border-outline-variant bg-surface-container-low px-8 py-2 font-meta-mono text-meta-mono text-on-surface-variant">
          Modo diagnóstico: qualquer conta autenticada pode abrir o admin (
          <span className="text-primary">ADMIN_ACCESS_ALLOW_ALL=true</span>). Desligue antes de produção.
        </div>
      ) : null}
      <div className="flex min-h-[60px] shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 px-8 py-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-h3 text-h3 text-on-surface">{title}</h1>
          {description ? (
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        <div className="flex min-w-0 shrink-0 items-center gap-4">
          {sessionEmail ? (
            <span
              className="hidden max-w-[min(280px,40vw)] truncate font-body-sm text-body-sm text-on-surface-variant sm:inline"
              title={sessionEmail}
            >
              {sessionEmail}
            </span>
          ) : (
            <span className="hidden font-body-sm text-body-sm text-on-surface-variant sm:inline">
              E-mail não disponível nesta sessão
            </span>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "ring-1 ring-outline-variant",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
