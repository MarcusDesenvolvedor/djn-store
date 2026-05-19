import Link from "next/link";
import { SalesRevenueAreaChart } from "@/components/admin/sales-revenue-area-chart";
import { getAdminDashboardPageData } from "@/features/admin-dashboard/admin-dashboard.service";
import { formatBrlPt } from "@/lib/format-brl";
import { ORDER_STATUS_PT, formatDateTimePt } from "@/lib/order-presentment";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { stats, recentOrders, revenueLast30Days } = await getAdminDashboardPageData();

  const chartPoints = revenueLast30Days.map((row) => ({
    dayYmd: row.dayYmd,
    revenue: Number.parseFloat(row.revenueBrl),
  }));

  return (
    <div className="mx-auto max-w-container-max space-y-10">
      <section className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Vendas Hoje (R$)
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              trending_up
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">
            R$ {formatBrlPt(stats.salesTodayBrl)}
          </p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Pagamentos confirmados neste dia corrido BRT.
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Pedidos Pendentes
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              hourglass_empty
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">{stats.pendingOrdersCount}</p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Pedidos com status de aguardo de pagamento.
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Ticket Médio
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              payments
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">
            R$ {formatBrlPt(stats.averageTicketLast30DaysBrl)}
          </p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Média em pedidos com pagamento confirmado (30 dias corridos BRT).
          </p>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60">
          <div className="flex items-start justify-between gap-3">
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Produtos Sem Estoque
            </span>
            <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
              inventory_2
            </span>
          </div>
          <p className="mt-4 font-h2 text-h2 tracking-tight tabular-nums text-on-surface">{stats.outOfStockActiveCount}</p>
          <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
            Catálogo ativo com quantidade igual a zero.
          </p>
        </div>
      </section>

      <section className="grid gap-gutter lg:grid-cols-5">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-3">
          <SalesRevenueAreaChart points={chartPoints} />
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-h3 text-h3 text-on-surface">Últimos Pedidos</h2>
            <Link
              href="/admin/pedidos"
              className="font-meta-mono text-meta-mono uppercase tracking-widest text-primary underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Estado do pedido com rótulos unificados no painel (ver documentação da feature dashboard).
          </p>
          {recentOrders.length === 0 ? (
            <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-background/40 px-6 py-10 text-center">
              <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
                receipt_long
              </span>
              <p className="font-body text-body text-on-surface-variant">Ainda não existem pedidos na base.</p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-outline-variant/80 overflow-hidden rounded border border-outline-variant bg-background/40">
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
                  <span className="shrink-0 tabular-nums font-medium text-on-surface">
                    R$ {formatBrlPt(row.totalAmountStr)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
