import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { listCategoriesForAdmin } from "@/features/category-admin/category-admin.service";

export default async function AdminCategoriasPage() {
  const categories = await listCategoriesForAdmin();

  return (
    <div className="mx-auto max-w-container-max space-y-10 pb-8">
      <div className="border-b border-outline-variant pb-4">
        <h2 className="font-h2 text-h2 text-on-surface">Categorias</h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Nomes usados para classificar produtos no cadastro administrativo. Opcionalmente, cada categoria pode ter uma
          imagem (URL). Categorias com produtos vinculados não podem ser excluídas.
        </p>
      </div>

      <CategoryCreateForm />

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-14 text-center">
          <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
            category
          </span>
          <p className="font-body text-body text-on-surface-variant">Nenhuma categoria ainda — use o formulário acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-outline-variant">
          <table className="w-full min-w-[640px] border-collapse text-left font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-3 w-[88px]">Imagem</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 text-center">Produtos</th>
                <th className="px-4 py-3">Criada em</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr key={row.id} className="border-b border-outline-variant/80 bg-background/40 text-on-surface last:border-b-0">
                  <td className="px-4 py-3 align-middle">
                    {row.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- URLs arbitrárias do admin
                      <img
                        src={row.imageUrl}
                        alt=""
                        className="h-12 w-12 rounded border border-outline-variant object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded border border-dashed border-outline-variant text-outline-variant"
                        title="Sem imagem"
                      >
                        <span className="material-symbols-outlined text-[22px]" aria-hidden>
                          image
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-center tabular-nums text-on-surface-variant">{row.productCount}</td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">
                    {row.createdAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CategoryDeleteButton
                      categoryId={row.id}
                      categoryName={row.name}
                      productCount={row.productCount}
                    />
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
