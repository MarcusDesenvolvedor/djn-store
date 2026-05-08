"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", match: "exact" as const },
  { href: "/admin/produtos", label: "Produtos", icon: "inventory_2", match: "prefix" as const },
  { href: "/admin/categorias", label: "Categorias", icon: "category", match: "prefix" as const },
  { href: "/admin/pedidos", label: "Pedidos", icon: "receipt_long", match: "prefix" as const },
  { href: "/admin/configuracoes", label: "Configurações", icon: "settings", match: "prefix" as const },
];

function isActive(pathname: string, href: string, match: "exact" | "prefix"): boolean {
  if (match === "exact") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest">
      <div className="border-b border-outline-variant px-6 py-6">
        <Link
          href="/admin"
          className="font-h3 text-h3 font-bold tracking-tighter text-on-surface transition-colors hover:text-primary"
        >
          DJN STORE
        </Link>
        <p className="mt-2 font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
          Painel admin
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.match);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded border border-transparent px-3 py-2.5 font-body-sm text-body-sm transition-colors",
                active
                  ? "border-outline-variant bg-surface-container text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:border-outline-variant/80 hover:bg-surface-container hover:text-on-surface",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${active ? "text-on-surface" : "text-outline"}`}
                aria-hidden
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant p-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden>
            storefront
          </span>
          Voltar à loja
        </Link>
      </div>
    </aside>
  );
}
