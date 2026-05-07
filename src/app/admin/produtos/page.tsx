export default function AdminProdutosPage() {
  return (
    <div className="mx-auto max-w-container-max">
      <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-20 text-center">
        <span className="material-symbols-outlined mb-4 text-[48px] text-outline-variant" aria-hidden>
          inventory_2
        </span>
        <h2 className="font-h3 text-h3 text-on-surface">Produtos</h2>
        <p className="mt-3 max-w-lg font-body text-body leading-relaxed text-on-surface-variant">
          Esta área receberá a grade de produtos com filtros por jogo, edição de estoque/preço e validação server-side,
          seguindo o fluxo API → serviço → repositório.
        </p>
      </div>
    </div>
  );
}
