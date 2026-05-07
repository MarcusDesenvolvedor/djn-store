# Feature: Catalog

## Purpose

Expose **read-only catalog context** for supported ARPG titles: list games (catalog root per game), later categories and products per `docs/mhp/overview.md`. No multi-tenant `storeId`; scope is **by game / catalog** only.

## Flows

### Public: list games

- **Method / route:** `GET /api/games`
- **Auth:** Public (Clerk middleware present globally; this route is not restricted).
- **Response:** `{ "data": GameListItem[] }` with `id`, `name`, `slug`, `createdAt`, `updatedAt`.
- **Errors:** `{ "error": string }` with `500` on unexpected failure (no stack traces in JSON).

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

- Storefront UI, filters, product listing, admin writes.
- Cart, checkout, orders.

**Status:** Active (API slice: list games)  
**Version:** 1.0
