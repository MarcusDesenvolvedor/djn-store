const STAT_PLACEHOLDERS = [
  {
    label: "Pedidos (24h)",
    hint: "Aguardando gateway de pagamentos",
    icon: "receipt_long",
  },
  {
    label: "Receita (24h)",
    hint: "Consolidado no próximo slice",
    icon: "payments",
  },
  {
    label: "Produtos ativos",
    hint: "Sincronizado com o catálogo",
    icon: "inventory_2",
  },
  {
    label: "Alertas de estoque",
    hint: "Regras por jogo em desenvolvimento",
    icon: "warning",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-container-max space-y-10">
      <section className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-4">
        {STAT_PLACEHOLDERS.map((card) => (
          <div
            key={card.label}
            className="rounded border border-outline-variant bg-surface-container-lowest p-6 transition-colors hover:border-on-surface-variant/60"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
                {card.label}
              </span>
              <span className="material-symbols-outlined text-[22px] text-outline-variant" aria-hidden>
                {card.icon}
              </span>
            </div>
            <p className="mt-4 font-h2 text-h2 tracking-tight text-on-surface">—</p>
            <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{card.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-gutter lg:grid-cols-5">
        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-h3 text-h3 text-on-surface">Atividade recente</h2>
            <span className="font-meta-mono text-meta-mono uppercase tracking-widest text-on-surface-variant">
              Em breve
            </span>
          </div>
          <div className="mt-8 flex min-h-[200px] flex-col items-center justify-center rounded border border-dashed border-outline-variant bg-background/40 px-6 py-10 text-center">
            <span className="material-symbols-outlined mb-3 text-[40px] text-outline-variant" aria-hidden>
              timeline
            </span>
            <p className="font-body text-body text-on-surface-variant">
              O feed de pedidos e alterações aparecerá aqui quando os módulos operacionais estiverem ligados.
            </p>
          </div>
        </div>

        <div className="rounded border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
          <h2 className="font-h3 text-h3 text-on-surface">Atalhos</h2>
          <ul className="mt-6 space-y-3 font-body-sm text-body-sm text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>
                chevron_right
              </span>
              Cadastro em massa de SKUs por importação (planejado).
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>
                chevron_right
              </span>
              Ajuste rápido de preços por liga/servidor (planejado).
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>
                chevron_right
              </span>
              Export CSV para conferência fiscal (planejado).
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
