# Feature: Admin — dashboard (métricas dinâmicas)

## Purpose

Exibir na home do painel **`/admin`** números reais vindos do PostgreSQL (pedidos nas últimas 24h, receita confirmada no período, produtos ativos, alertas de estoque) e lista recente de pedidos — sem placeholders estáticos. Alinhar ao shell admin em `docs/mhp/features/admin/feature.md`.

## Flows

### Staff abre `/admin`

1. Servidor monta página com dados de `admin-dashboard.service.ts` → `admin-dashboard.repository.ts` (único acesso Prisma).
2. Cards refletem agregações; “Atividade recente” lista os últimos pedidos com link para o detalhe.

### Staff abre `/admin/configuracoes`

- Bloco opcional **Resumo da operação** reutiliza as mesmas agregações (somente contagens/resumo), até existir modelo de preferências persistido.

## Business rules

- **Janela 24h:** rolante (`now - 24h`), UTC implícito do servidor (`Date`).
- **Receita (24h):** soma de `Order.totalAmount` em pedidos cuja cobrança `Payment` está **CONFIRMED** e **`confirmedAt` ≥ início da janela**. Pedidos sem pagamento ou pendentes não entram.
- **Pedidos (24h):** contagem por `Order.createdAt` na janela (todos os status).
- **Estoque baixo:** produtos **ativos** com `stock` **&lt;** `ADMIN_LOW_STOCK_THRESHOLD` (`admin-dashboard.constants.ts`; hoje **5**).

## Entities

`Order`, `Payment`, `Product`, `Category` (`prisma/schema.prisma`).

## API

- Nenhum endpoint nesta fatia; páginas server components consomem o service.

**Status:** Active  
**Version:** 1.0
