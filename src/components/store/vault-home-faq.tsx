"use client";

import { useCallback, useState } from "react";

const FAQ_ITEMS = [
  {
    id: "battletag-d4",
    question: "Como saber minha BattleTag no Diablo IV?",
    answer:
      "Abra o aplicativo Battle.net ou acesse account.blizzard.com e faça login. No perfil da conta Blizzard, sua BattleTag aparece no formato Nome#1234 (números após o #). Esse é o identificador usado nos jogos Blizzard, incluindo Diablo IV, para amigos e para algumas entregas — confira sempre se copiou o texto completo.",
  },
  {
    id: "perfil-poe",
    question: "Como saber meu perfil no Path of Exile?",
    answer:
      "No cliente Path of Exile, use o menu de personagens ou pressione a tecla de perfil conforme suas configurações para ver o nome do personagem e a liga (realm). No site pathofexile.com, em “Minha conta”, você encontra dados da conta e personagens. Na hora da compra, use exatamente o nome e a liga/servidor pedidos na página do produto para evitar atrasos.",
  },
  {
    id: "psn-acesso",
    question: "Como funciona o acesso a conta PSN?",
    answer:
      "Para itens ligados ao ecossistema PlayStation, normalmente pedimos apenas seu Online ID (nome público na PSN) ou outro identificador indicado no checkout — isso serve para localizar a entrega correta. Nunca solicitamos senha da PSN. Siga as instruções exibidas na página do produto e no resumo do pedido; métodos podem variar (trade in-game, código, etc.).",
  },
  {
    id: "prazo-entrega",
    question: "Quanto tempo até receber meu produto?",
    answer:
      "O tempo depende do jogo, tipo de item, disponibilidade e fila de pedidos. Muitas entregas começam minutos após a confirmação do pagamento; cenários mais específicos (horário, validação manual ou filas altas) podem estender o prazo. Você pode acompanhar o status na área do pedido e pelas notificações enviadas pelo site.",
  },
  {
    id: "cupom",
    question: "Como aplicar um cupom de desconto?",
    answer:
      "No carrinho ou no checkout, procure o campo “Cupom”, “Código promocional” ou equivalente, digite o código e clique em aplicar antes de finalizar a compra. Cupons podem ter data de validade, valor mínimo ou restrição por jogo/categoria — se o código for recusado, a mensagem exibida indica o motivo.",
  },
] as const;

export function VaultHomeFaq() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <section
      className="mx-auto w-full max-w-container-max border-t border-outline-variant px-margin-page py-section-gap"
      id="faq"
      aria-labelledby="faq-heading"
    >
      <div className="mb-12 text-center md:mb-16">
        <h2 id="faq-heading" className="font-h2 text-h2 text-on-surface">
          Perguntas frequentes
        </h2>
        <p className="mx-auto mt-2 max-w-2xl font-body text-body text-on-surface-variant">
          Respostas rápidas sobre identificadores de conta, entrega e uso de cupons nesta loja.
        </p>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-base">
        {FAQ_ITEMS.map((item) => {
          const isOpen = Boolean(open[item.id]);
          const panelId = `faq-panel-${item.id}`;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded border border-outline-variant bg-surface-container-lowest transition-colors hover:border-on-surface-variant/80"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-surface-container"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={`faq-trigger-${item.id}`}
              >
                <span className="font-body text-body font-medium text-on-surface">{item.question}</span>
                <span
                  className={`material-symbols-outlined shrink-0 text-[22px] text-outline-variant transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  expand_more
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                hidden={!isOpen}
                className="border-t border-outline-variant"
              >
                <p className="px-4 pb-4 pt-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
