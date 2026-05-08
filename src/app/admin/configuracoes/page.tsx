import Link from "next/link";
import { ADMIN_LOW_STOCK_THRESHOLD } from "@/features/admin-dashboard/admin-dashboard.constants";
import { getAdminDashboardStats } from "@/features/admin-dashboard/admin-dashboard.service";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="mx-auto max-w-container-max space-y-10">
      <section className="rounded border border-outline-variant bg-surface-container-lowest p-6">
        <h2 className="font-h3 text-h3 text-on-surface">Resumo da operação</h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Números ao vivo do PostgreSQL (mesma origem do dashboard). Use as áreas específicas para editar dados.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Produtos</dt>
            <dd className="mt-1 font-h3 text-h3 tabular-nums text-on-surface">{stats.totalProducts}</dd>
            <dd className="mt-1 font-body-sm text-on-surface-variant">{stats.activeProducts} ativos</dd>
          </div>
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Categorias</dt>
            <dd className="mt-1 font-h3 text-h3 tabular-nums text-on-surface">{stats.categoriesCount}</dd>
          </div>
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Pedidos</dt>
            <dd className="mt-1 font-h3 text-h3 tabular-nums text-on-surface">{stats.totalOrdersAllTime}</dd>
            <dd className="mt-1 font-body-sm text-on-surface-variant">{stats.ordersLast24h} nas últimas 24h</dd>
          </div>
          <div>
            <dt className="font-meta-mono text-meta-mono uppercase tracking-wider text-on-surface-variant">Alertas estoque</dt>
            <dd className="mt-1 font-h3 text-h3 tabular-nums text-on-surface">{stats.lowStockActiveCount}</dd>
            <dd className="mt-1 font-body-sm text-on-surface-variant">
              Ativos com estoque &lt; {ADMIN_LOW_STOCK_THRESHOLD}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="micro-chamfer inline-flex items-center gap-2 border border-outline-variant px-4 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-container"
          >
            Abrir dashboard
          </Link>
          <Link
            href="/admin/produtos"
            className="micro-chamfer inline-flex items-center gap-2 border border-outline-variant px-4 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-container"
          >
            Gerir produtos
          </Link>
        </div>
      </section>

      <div className="grid gap-gutter lg:grid-cols-2">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6">
          <h2 className="font-h3 text-h3 text-on-surface">Identidade da loja</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Nome exibido, idiomas e textos legais — quando existir modelo persistido, os valores aparecerão aqui; o
            cliente usa React Hook Form + Zod na camada de API.
          </p>
          <div className="mt-8 rounded border border-dashed border-outline-variant bg-background/30 px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Sem registro em banco nesta slice — apenas copy estática até a feature de preferências da loja.
          </div>
        </div>
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6">
          <h2 className="font-h3 text-h3 text-on-surface">Operações</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Integrações (pagamento, entrega, notificações): configuração sensível só no servidor/env; formulários públicos
            não expõem segredos.
          </p>
          <div className="mt-8 rounded border border-dashed border-outline-variant bg-background/30 px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Sem registros configuráveis no banco nesta slice — usar variáveis de ambiente até haver persistência segura.
          </div>
        </div>
      </div>
    </div>
  );
}
