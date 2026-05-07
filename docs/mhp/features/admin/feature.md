# Feature: Admin panel (shell & access)

## Purpose

**Operational UI** for catalog, stock, and configuration (`docs/mhp/overview.md` admin area). This slice delivers the **authenticated shell** (sidebar, header, routes) and **email allowlist** authorization—no multi-tenant `storeId`; scope remains **game/catalog**.

## Flows

### Staff opens `/admin`

1. **Not signed in (Clerk)** → redirect to `/sign-in`.
2. **Signed in** → evaluate access:
   - If **`ADMIN_ACCESS_ALLOW_ALL=true`** (temporary diagnostics): **any** authenticated session may render the admin shell — **do not use in production**.
   - Else: primary e-mail from Clerk **normalized** (trim, lowercase); must exist in `admin_allowed_emails`, otherwise redirect to `/`.

### Navigation

- `/admin` — Dashboard (overview placeholders).
- `/admin/produtos` — Produtos.
- `/admin/categorias` — Categorias.
- `/admin/configuracoes` — Configurações.

## Business rules

- **`ADMIN_ACCESS_ALLOW_ALL`** (`process.env`): when **`true`**, any authenticated Clerk session passes the admin gate (**debugging only**; leave **`false`** in production).
- With **`ADMIN_ACCESS_ALLOW_ALL=false`** (default): **Admin access** requires the Clerk user’s **primary e-mail** (normalized) to exist in **`AdminAllowedEmail`** (`prisma/schema.prisma`).
- Allowlist entries are created by **inserting** the normalized e-mail in the database (Prisma Studio, SQL, or seed)—never rely on client-side checks alone.

## Entities involved

- **`AdminAllowedEmail`**: `email` (unique), timestamps.

## API endpoints

- None for this slice (server layout + DB read only).

## UI behavior

- **Design:** mesmos tokens Tailwind da storefront Stitch (`tailwind.config.ts`): superfície escura, bordas `outline-variant`, tipografia `font-h2` / `font-body-sm`, ícones Material Symbols.
- **Layers:** `src/app/admin/layout.tsx` → auth + allowlist → compose sidebar/header; **business rule** em `admin-access.service.ts`; Prisma só em `admin-access.repository.ts`.

## Dependencies

- Clerk (`auth`, `currentUser`, páginas `/sign-in`, `/sign-up`).
- PostgreSQL + Prisma.

## Out of scope (current slice)

- CRUD produtos/categorias/pedidos reais.
- APIs admin e mutations na allowlist pela UI.

**Status:** Active (shell + allowlist)  
**Version:** 1.0
