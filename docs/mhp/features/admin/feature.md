# Feature: Admin panel (shell & access)

## Purpose

**Operational UI** for catalog, stock, and configuration (`docs/mhp/overview.md` admin area). This slice delivers the **authenticated shell** (sidebar, header, routes) and **email allowlist** authorization—no multi-tenant `storeId`; scope remains **game/catalog**.

## Flows

### Staff opens `/admin`

1. **Not signed in (Clerk)** → redirect to `/sign-in`.
2. **Signed in** → read primary e-mail from Clerk; **normalize** (trim, lowercase).
3. **Allowlist** → if e-mail exists in `admin_allowed_emails` → render admin layout; else redirect to `/`.

### Navigation

- `/admin` — Dashboard (overview placeholders).
- `/admin/produtos` — Produtos.
- `/admin/categorias` — Categorias.
- `/admin/configuracoes` — Configurações.

## Business rules

- **Admin access** is granted only when the Clerk user’s **primary e-mail** matches a row in **`AdminAllowedEmail`** (`prisma/schema.prisma`).
- Enabling an admin is done by **inserting** the normalized e-mail in the database (Prisma Studio, SQL, ou seed)—not via client-side checks alone.

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
