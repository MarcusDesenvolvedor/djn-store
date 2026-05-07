export default function AdminConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-container-max">
      <div className="grid gap-gutter lg:grid-cols-2">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6">
          <h2 className="font-h3 text-h3 text-on-surface">Identidade da loja</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Nome exibido, idiomas e textos legais — formulários com React Hook Form + Zod quando esta seção for
            implementada.
          </p>
          <div className="mt-8 rounded border border-dashed border-outline-variant bg-background/30 px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Sem dados configuráveis neste slice.
          </div>
        </div>
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6">
          <h2 className="font-h3 text-h3 text-on-surface">Operações</h2>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
            Integrações (pagamento, entrega, notificações) e limites operacionais ficarão aqui, sem lógica sensível no
            cliente.
          </p>
          <div className="mt-8 rounded border border-dashed border-outline-variant bg-background/30 px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
            Sem dados configuráveis neste slice.
          </div>
        </div>
      </div>
    </div>
  );
}
