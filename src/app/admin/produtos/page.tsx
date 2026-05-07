import Link from "next/link";
import { listAdminProducts } from "@/features/product-admin/product-admin.service";

export default async function AdminProdutosPage() {
  const products = await listAdminProducts(100);

  return (
    <div className="mx-auto max-w-container-max space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Produtos</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Catálogo administrativo — preço e estoque por SKU.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="micro-chamfer inline-flex items-center gap-2 bg-on-surface px-6 py-2.5 font-button text-button text-surface transition-colors hover:bg-primary"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden>
            add
          </span>
          Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-16 text-center">
          <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
            inventory_2
          </span>
          <p className="font-body text-body text-on-surface-variant">Nenhum produto cadastrado ainda.</p>
          <Link
            href="/admin/produtos/novo"
            className="mt-6 font-body-sm text-body-sm text-primary underline-offset-4 hover:underline"
          >
            Criar o primeiro produto
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-outline-variant">
          <table className="w-full min-w-[720px] border-collapse text-left font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Jogo</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Preço</th>
                <th className="px-4 py-3 text-right">Estoque</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((row) => (
                <tr key={row.id} className="border-b border-outline-variant/80 bg-background/40 text-on-surface last:border-b-0">
                  <td className="px-4 py-3 font-medium">{row.sku}</td>
                  <td className="max-w-[220px] truncate px-4 py-3" title={row.name}>
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{row.gameName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{row.categoryName}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.price.toString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        row.isActive
                          ? "rounded-sm border border-outline-variant bg-surface-container-low px-2 py-0.5 font-meta-mono text-meta-mono text-primary"
                          : "rounded-sm border border-outline-variant px-2 py-0.5 font-meta-mono text-meta-mono text-on-surface-variant"
                      }
                    >
                      {row.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
