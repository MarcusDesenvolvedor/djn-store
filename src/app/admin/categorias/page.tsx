export default function AdminCategoriasPage() {
  return (
    <div className="mx-auto max-w-container-max">
      <div className="flex flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-surface-container-lowest/40 px-8 py-20 text-center">
        <span className="material-symbols-outlined mb-4 text-[48px] text-outline-variant" aria-hidden>
          category
        </span>
        <h2 className="font-h3 text-h3 text-on-surface">Categorias</h2>
        <p className="mt-3 max-w-lg font-body text-body leading-relaxed text-on-surface-variant">
          Aqui ficará a gestão de categorias por jogo (árvore, slug e vínculo com produtos), isolada por contexto de
          catálogo conforme a arquitetura ARPG.
        </p>
      </div>
    </div>
  );
}
