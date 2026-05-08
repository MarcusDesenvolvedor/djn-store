import Link from "next/link";
import { listOrdersForAdmin } from "@/features/order-admin/order-admin.service";
import { ORDER_STATUS_PT, formatDateTimePt } from "@/lib/order-presentment";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const orders = await listOrdersForAdmin();

  return (
    <div className="mx-auto max-w-container-max space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Pedidos</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Pedidos recebidos na loja — clique para ver dados completos do cliente e pagamento.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
            receipt_long
          </span>
          <p className="font-body text-body text-on-surface-variant">Nenhum pedido registrado ainda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-outline-variant">
          <table className="w-full min-w-[720px] border-collapse text-left font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-center">Itens</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-outline-variant/80 bg-background/40 transition-colors hover:bg-surface-container-lowest/50 last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${row.id}`}
                      className="group inline-flex items-center gap-1 font-meta-mono text-meta-mono text-primary underline-offset-4 hover:underline"
                    >
                      <span className="max-w-[200px] truncate" title={row.id}>
                        {row.id.slice(0, 8)}…
                      </span>
                      <span className="material-symbols-outlined text-[16px] opacity-70 transition-opacity group-hover:opacity-100" aria-hidden>
                        chevron_right
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-sm border border-outline-variant bg-surface-container-low px-2 py-0.5 font-meta-mono text-meta-mono text-on-surface">
                      {ORDER_STATUS_PT[row.status]}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-on-surface" title={`${row.firstName} ${row.lastName}`}>
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums text-on-surface-variant">{row.itemCount}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-on-surface">R$ {row.totalAmountStr}</td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">{formatDateTimePt(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
