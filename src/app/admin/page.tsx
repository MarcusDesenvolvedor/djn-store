import Link from "next/link";
import { ADMIN_LOW_STOCK_THRESHOLD } from "@/features/admin-dashboard/admin-dashboard.constants";
import { getAdminDashboardPageData } from "@/features/admin-dashboard/admin-dashboard.service";
import { ORDER_STATUS_PT, formatDateTimePt } from "@/lib/order-presentment";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { stats, recentOrders } = await getAdminDashboardPageData();

  const revenueDisplay = stats.revenueLast24h.includes(".")
    ? stats.revenueLast24h
    : `${stats.revenueLast24h},00`;

  return (
    <div className="mx-auto max-w-container-max space-y-10">
      <section className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Pedidos (24h)
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              receipt_long
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">{stats.ordersLast24h}</p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Novos pedidos por data de criação (últimas 24h).
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Receita (24h)
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              payments
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">
            R$ {revenueDisplay}
          </p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Soma dos pedidos com pagamento confirmado no período.
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Produtos ativos
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              inventory_2
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">{stats.activeProducts}</p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            {stats.totalProducts} no catálogo (ativos + inativos).
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Estoque baixo
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              warning
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">
            {stats.lowStockActiveCount}
          </p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Ativos com estoque &lt; {ADMIN_LOW_STOCK_THRESHOLD} un.
          </p>
        </div>
      </section>

      <section className="grid gap-gutter lg:grid-cols-5">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-h3 text-h3 text-on-surface">Pedidos recentes</h2>
            <Link
              href="/admin/pedidos"
              className="font-meta-mono text-meta-mono uppercase tracking-widest text-primary underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-background/40 px-6 py-10 text-center">
              <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
                receipt_long
              </span>
              <p className="font-body text-body text-on-surface-variant">
                Nenhum pedido na base ainda. Quando existirem, aparecerão aqui por ordem cronológica.
              </p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-outline-variant/80 border border-outline-variant rounded bg-background/40">
              {recentOrders.map((row) => (
                <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 font-body-sm text-body-sm">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/pedidos/${row.id}`}
                      className="font-meta-mono text-meta-mono text-primary underline-offset-4 hover:underline"
                      title={row.id}
                    >
                      {row.id.slice(0, 8)}…
                    </Link>
                    <p className="mt-1 text-on-surface">
                      {row.firstName} {row.lastName}
                    </p>
                    <p className="mt-0.5 text-on-surface-variant">
                      <span className="rounded-sm border border-outline-variant bg-surface-container-low px-1.5 py-0.5 font-meta-mono text-meta-mono text-on-surface">
                        {ORDER_STATUS_PT[row.status]}
                      </span>
                      <span className="ml-2 tabular-nums">{formatDateTimePt(row.createdAt)}</span>
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums font-medium text-on-surface">R$ {row.totalAmountStr}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
          <h2 className="font-h3 text-h3 text-on-surface">Atalhos</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Navegação rápida com totais atuais do banco de dados.
          </p>
          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="/admin/produtos"
                className="flex items-center justify-between gap-3 rounded border border-outline-variant bg-background/40 px-4 py-3 font-body-sm text-body-sm text-on-surface transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden>
                    inventory_2
                  </span>
                  Produtos
                </span>
                <span className="tabular-nums text-on-surface-variant">{stats.totalProducts}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categorias"
                className="flex items-center justify-between gap-3 rounded border border-outline-variant bg-background/40 px-4 py-3 font-body-sm text-body-sm text-on-surface transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden>
                    category
                  </span>
                  Categorias
                </span>
                <span className="tabular-nums text-on-surface-variant">{stats.categoriesCount}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pedidos"
                className="flex items-center justify-between gap-3 rounded border border-outline-variant bg-background/40 px-4 py-3 font-body-sm text-body-sm text-on-surface transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden>
                    receipt_long
                  </span>
                  Pedidos
                </span>
                <span className="tabular-nums text-on-surface-variant">{stats.totalOrdersAllTime}</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
