import { CategoryAdminTree } from "@/components/admin/category-admin-tree";
import { listCategoryAdminTreeForAdmin } from "@/features/category-admin/category-admin.service";

export default async function AdminCategoriasPage() {
  const roots = await listCategoryAdminTreeForAdmin();

  return (
    <div className="mx-auto max-w-container-max space-y-10 pb-8">
      <div className="border-b border-outline-variant pb-4">
        <h2 className="font-h2 text-h2 text-on-surface">Categorias</h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Hierarquia de categorias (raiz → subcategorias). Clique na seta para expandir ou recolher. Use o botão com “+”
          para criar uma subcategoria sob o nível atual. Produtos ficam sempre em uma única folha ou nó —
          só é possível excluir quando não há produtos nem subpastas ligadas ao item.
        </p>
      </div>

      <CategoryAdminTree roots={roots} />
    </div>
  );
}
