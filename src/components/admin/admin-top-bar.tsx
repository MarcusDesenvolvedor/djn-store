"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

/** Light styling for fallback local-part derived names (avoid showing full email in UI). */
function lightTitleCaseLocalPart(localPart: string): string {
  const trimmed = localPart.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

/** Prefer first name → first word of full name → email local-part (never render full email as the label). */
function adminSessionFirstDisplayName(user: ReturnType<typeof useUser>["user"]): string {
  if (!user) {
    return "Conta";
  }
  const firstName = user.firstName?.trim();
  if (firstName) {
    return firstName;
  }
  const full = user.fullName?.trim();
  if (full) {
    const token = full.split(/\s+/u)[0]?.trim();
    if (token) {
      return token;
    }
  }
  const emailAddress = user.primaryEmailAddress?.emailAddress?.trim();
  if (emailAddress) {
    const localPart = emailAddress.split("@")[0]?.trim();
    if (localPart) {
      return lightTitleCaseLocalPart(localPart);
    }
  }
  return "Conta";
}

const ROUTE_TITLES: { prefix: string; title: string; description: string }[] = [
  { prefix: "/admin/produtos/novo", title: "Novo produto", description: "Cadastro com categoria e ID gerado pelo banco." },
  { prefix: "/admin/produtos", title: "Produtos", description: "Lista ao vivo do catálogo (preço, estoque, status)." },
  { prefix: "/admin/categorias", title: "Categorias", description: "Lista ao vivo; contagens por categoria vindas do banco." },
  { prefix: "/admin/pedidos", title: "Pedidos", description: "Pedidos ao vivo com cliente, itens e pagamento." },
  {
    prefix: "/admin/clientes",
    title: "Clientes",
    description: "Gestão da base quando o modelo CRM existir nesta área.",
  },
  {
    prefix: "/admin/configuracoes",
    title: "Configurações",
    description: "Resumo operacional dinâmico; preferências persistidas quando existirem no modelo.",
  },
];

function getHeading(pathname: string): { title: string; description: string } {
  if (pathname === "/admin") {
    return {
      title: "Dashboard de vendas",
      description: "KPIs, faturamento (30 dias) e últimos pedidos — dados ao vivo PostgreSQL.",
    };
  }
  const hit = ROUTE_TITLES.find((r) => pathname.startsWith(r.prefix));
  if (hit) {
    return { title: hit.title, description: hit.description };
  }
  return { title: "Admin", description: "" };
}

export type AdminTopBarProps = {
  openAdminAccess: boolean;
};

function IdentityLoadingSkeleton() {
  return (
    <span className="hidden min-h-[2.25rem] min-w-[8rem] items-center sm:inline-flex" aria-busy aria-live="polite">
      <span className="h-4 max-w-[min(200px,30vw)] flex-1 animate-pulse rounded bg-surface-container-high" />
    </span>
  );
}

export function AdminTopBar({ openAdminAccess }: AdminTopBarProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { title, description } = getHeading(pathname);
  const displayName = adminSessionFirstDisplayName(user);

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
          {!isLoaded ? (
            <IdentityLoadingSkeleton />
          ) : (
            <span className="hidden min-w-0 max-w-[min(320px,50vw)] items-center sm:inline-flex">
              <span
                className="min-w-0 truncate font-body-sm text-body-sm text-on-surface-variant"
                title={displayName}
              >
                {displayName}
              </span>
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
