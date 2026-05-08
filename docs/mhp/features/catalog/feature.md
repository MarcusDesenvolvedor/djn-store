# Feature: Catalog

## Purpose

Expose **read-only catalog context** for supported ARPG titles: list games (catalog root per game), later categories and products per `docs/mhp/overview.md`. No multi-tenant `storeId`; scope is **by game / catalog** only.

## Flows

### Public: list games

- **Method / route:** `GET /api/games`
- **Auth:** Public (Clerk middleware present globally; this route is not restricted).
- **Response:** `{ "data": GameListItem[] }` with `id`, `name`, `slug`, `createdAt`, `updatedAt`.
- **Errors:** `{ "error": string }` with `500` on unexpected failure (no stack traces in JSON).

### Public: product page (read-only)

- **Route:** `/produtos/[productId]` (App Router, servidor).
- **Auth:** Public.
- **Behavior:** Exibe um produto pelo ID numérico (preço, estoque, ativo/inativo, imagens, descrição), alinhado ao estado atual do cadastro — para preview a partir do admin e futura vitrine.

## Business rules

- Games are the **root** of catalog segmentation (`docs/mhp/data-model.md` Game aggregate).
- Listing returns games ordered by `name` ascending.
- Cross-game isolation for categories/products applies when those endpoints exist (`business-logic.md`).

## Dependencies

- PostgreSQL + Prisma (`Game` model).
- `docs/mhp/data-model.md`, `docs/mhp/business-logic.md`, `docs/rules/architecture.md`.

## Implementation notes

- **Layers:** `src/app/api/games/route.ts` (handler) → `catalog.service.ts` → `catalog.repository.ts` (only Prisma).
- **Validation:** No query/body on initial `GET`; add Zod when filters/query params are introduced per `workflow-api-endpoint.md`.

## Out of scope (current slice)

- Storefront home shell (hero) only; filtros e listagem completa de produtos na home.
- Cart, checkout, pedidos no fluxo público.

**Status:** Active (list games API + página pública de produto por ID)  
**Version:** 1.1