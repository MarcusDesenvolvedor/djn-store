import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderAdminDetailById } from "@/features/order-admin/order-admin.service";
import {
  ORDER_STATUS_PT,
  PAYMENT_STATUS_PT,
  formatDateTimePt,
} from "@/lib/order-presentment";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ orderId: string }>;
}>;

export default async function AdminPedidoDetalhePage({ params }: Props) {
  const { orderId } = await params;
  const order = await getOrderAdminDetailById(orderId);
  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-container-max space-y-8 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-outline-variant pb-4">
        <div className="min-w-0">
          <nav className="mb-4 font-body-sm text-body-sm text-on-surface-variant">
            <Link href="/admin/pedidos" className="transition-colors hover:text-primary">
              Pedidos
            </Link>
            <span aria-hidden className="mx-2 text-outline-variant">
              /
            </span>
            <span className="break-all font-mono text-on-surface">{order.id}</span>
          </nav>
          <h2 className="font-h2 text-h2 text-on-surface">Detalhe do pedido</h2>
          <p className="mt-2 font-meta-mono text-meta-mono text-on-surface-variant">
            Pedido criado em {formatDateTimePt(order.createdAt)}
          </p>
        </div>
        <span className="shrink-0 rounded-sm border border-outline-variant bg-surface-container-low px-3 py-1 font-meta-mono text-meta-mono text-on-surface">
          {ORDER_STATUS_PT[order.status]}
        </span>
      </div>

      <section className="rounded border border-outline-variant bg-background/40 p-6">
        <h3 className="mb-4 font-h3 text-h3 text-on-surface">Cliente e entrega</h3>
        <dl className="grid gap-4 font-body-sm text-body-sm sm:grid-cols-2">
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Nome</dt>
            <dd className="mt-1 text-on-surface">
              {order.firstName} {order.lastName}
            </dd>
          </div>
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Telefone</dt>
            <dd className="mt-1 text-on-surface">{order.phone}</dd>
          </div>
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Documento</dt>
            <dd className="mt-1 text-on-surface">{order.identificationNumber}</dd>
          </div>
          {order.userEmail ? (
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                Conta (e-mail)
              </dt>
              <dd className="mt-1 break-all text-on-surface">{order.userEmail}</dd>
            </div>
          ) : (
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                Conta (e-mail)
              </dt>
              <dd className="mt-1 text-on-surface-variant">Convidado / não vinculado</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Endereço</dt>
            <dd className="mt-1 text-on-surface">
              {order.street}, {order.number} — {order.city} / {order.state}, {order.country}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded border border-outline-variant bg-background/40 p-6">
        <h3 className="mb-4 font-h3 text-h3 text-on-surface">Pagamento</h3>
        {order.payment ? (
          <dl className="grid gap-4 font-body-sm text-body-sm sm:grid-cols-2">
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Status</dt>
              <dd className="mt-1 text-on-surface">{PAYMENT_STATUS_PT[order.payment.status]}</dd>
            </div>
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                Forma de pagamento
              </dt>
              <dd className="mt-1 text-on-surface">
                {order.payment.method ?? "Não cadastrado (checkout integrado registrará quando existir)"}
              </dd>
            </div>
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                Registro do pagamento
              </dt>
              <dd className="mt-1 text-on-surface">{formatDateTimePt(order.payment.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">
                Data confirmada / pago
              </dt>
              <dd className="mt-1 text-on-surface">
                {order.payment.confirmedAt ? formatDateTimePt(order.payment.confirmedAt) : "—"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="font-body text-body text-on-surface-variant">
            Este pedido ainda não tem registro de pagamento na base.
          </p>
        )}
      </section>

      <section className="rounded border border-outline-variant bg-background/40 p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-h3 text-h3 text-on-surface">Produtos</h3>
          <p className="font-body-sm tabular-nums text-on-surface-variant">
            Total do pedido: <span className="font-semibold text-on-surface">R$ {order.totalAmountStr}</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                <th className="py-3 pr-4 text-left">Produto</th>
                <th className="px-4 py-3 text-center">Qtd</th>
                <th className="px-4 py-3 text-right">Preço unit.</th>
                <th className="py-3 pl-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/80 text-on-surface last:border-b-0">
                  <td className="py-3 pr-4">
                    <span className="block font-medium">{item.productName}</span>
                    <Link
                      href={`/produtos/${item.productId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 font-meta-mono text-meta-mono text-primary underline-offset-4 hover:underline"
                    >
                      Ver na loja
                      <span className="material-symbols-outlined text-[14px]" aria-hidden>
                        open_in_new
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="px-4 py-3 text-right tabular-nums">R$ {item.unitPriceStr}</td>
                  <td className="py-3 pl-4 text-right tabular-nums">R$ {item.lineTotalStr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
