# Feature: Admin — dashboard (métricas dinâmicas)

## Purpose

Exibir **`/admin`** (“Dashboard de vendas”) com **KPIs e gráficos reais PostgreSQL**, lista **Últimos Pedidos**, e navegação alinhada ao shell admin (`docs/mhp/features/admin/feature.md`). Sem placeholders estáticos para métricas principais.

## Flows

### Staff abre `/admin`

1. Servidor monta página com dados de `admin-dashboard.service.ts` → `admin-dashboard.repository.ts` (único acesso Prisma nesta slice).
2. Quatro KPIs + gráfico de área **faturamento 30 dias** + widget logístico de pedidos recentes.

### Staff abre `/admin/configuracoes`

- Bloco **Resumo da operação** reutiliza as mesmas contagens onde aplicável até existirem preferências persistidas.

## Business rules — KPIs

- **Timezone de “dia corrido”:** `America/Sao_Paulo` (BRT, UTC−3 — sem DST) para cortes **hoje** e para ** série de 30 dias corridos**.
- **Vendas Hoje (R$):** soma de `Order.totalAmount` onde `Payment.status === CONFIRMED` e **`Payment.confirmedAt`** cai na janela **\[início BRT de hoje, início BRT de amanhã)**.
- **Pedidos Pendentes:** contagens onde `Order.status === PENDING_PAYMENT`.
- **Ticket Médio (R$):** `Σ totalAmount ÷ quantidade de pedidos` para pedidos cuja cobrança está **CONFIRMED** nos **últimos 30 dias corridos BRT** (mesma janela do gráfico). Se não houver pedidos, mostrar **R$ 0**.
- **Produtos Sem Estoque:** produtos **ativos** (`isActive=true`) com `stock === 0`.
- **[Legado só para texto secundário / config]** **Pedidos (24h rolantes):** contagem por `Order.createdAt ≥ now − 24h`, UTC servidor (comportamento já usado nas config).

## Séries temporais

- **Área «Faturamento (30 dias)»:** dias **BRT sem buracos**, um ponto por dia; valores = somas de `totalAmount` de pedidos cuja **`Payment.confirmedAt`** cai naquele **dia BRT**; dias sem dados = zero.

## Labels de estado (painel PT-BR)

Mapeamento visível **`ORDER_STATUS_PT`** (`src/lib/order-presentment.ts`):

| Enum | Rótulo |
|-----|-----|
| `PENDING_PAYMENT` | Aguardando Pagamento |
| `PAID`, `FULFILLING` | Em Separação (ambos = pós‑pagamento até envio/fecho) |
| `DELIVERED` | Enviado |
| `CANCELED` | Cancelado |

## Entities

`Order`, `Payment`, `Product`, `Category` (`prisma/schema.prisma`).

## API

- Nenhum endpoint público específico; **Route Handlers** opcionais se no futuro o dashboard for cliente-only — hoje páginas **server components** chamam apenas o **service**.

**Status:** Active  
**Version:** 1.1
