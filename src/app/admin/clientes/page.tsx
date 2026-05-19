export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  return (
    <div className="mx-auto max-w-container-max space-y-8">
      <section className="rounded border border-outline-variant bg-surface-container-lowest p-8">
        <h2 className="font-h3 text-h3 text-on-surface">Clientes</h2>
        <p className="mt-2 max-w-xl font-body-sm text-body-sm text-on-surface-variant">
          Esta área ficará disponível quando houver modelo de CRM ou relatórios de clientes definidos nos documentos da feature.
          A URL mantém navegação coerente com o novo menu lateral até essa parte ser implementada.
        </p>
        <div className="mt-8 rounded border border-dashed border-outline-variant bg-background/40 px-4 py-16 text-center font-body-sm text-on-surface-variant">
          Nenhuma listagem nesta versão inicial.
        </div>
      </section>
    </div>
  );
}
