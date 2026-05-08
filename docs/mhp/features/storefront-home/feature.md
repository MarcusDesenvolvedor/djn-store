# Feature: Storefront home (public landing)

## Purpose

Public **home page** for the ARPG virtual goods storefront: strong first impression, **Gamer Dark** aesthetic, fast orientation toward catalog browsing (`docs/mhp/overview.md`). No business rules on the client beyond navigation and static marketing copy.

**Design source:** Stitch project *Nexus ARPG Storefront*, screen *Home - VAULT.ARPG* (`projects/14319505650371071443/screens/9501dc4562814be4b7d55dfee7248bd3`). UI aims for **visual parity** with the exported HTML (tokens, typography, sections, imagery URLs).

## Flows

### Visitor lands on `/`

- Sees **hero**: headline, value proposition, primary CTA toward catalog exploration, supported games called out.
- Secondary actions may link to anchors or future routes (e.g. catalog by game).

## Business rules

- Copy and UX align with **experience pillars**: immersive dark theme, trust, fast navigation by game (`overview.md`).
- No multi-tenant “store” framing; catalog is organised by **supported game** only (`architecture.md`).

## Entities involved

- None required for the hero slice (static UI). Later: games list may reuse catalog APIs (`catalog` feature).

## API endpoints

- None for initial hero (static). Future: optional `GET /api/games` for dynamic game chips.

## UI behavior

- **Layers:** `src/app/page.tsx` composes storefront components; hero lives under `src/components/store/`.
- Presentational components only; no catalog or pricing logic in UI.

### FAQ (landing)

- **Location:** Home (`/`), seção `#faq` após “Processo de Aquisição”.
- **Behavior:** Acordeão por item (expandir/recolher ao clicar na pergunta); apenas estado de UI no cliente (`vault-home-faq.tsx`).
- **Copy:** PT-BR; políticas finais de entrega/PSN ficam alinhadas ao checkout e ao suporte quando existirem.

## Dependencies

- Next.js App Router, Tailwind CSS (`workflow-frontend-component.md`).
- `docs/mhp/overview.md`, `docs/rules/architecture.md`.

## Out of scope (current slice)

- Cart, checkout, auth-gated flows.
- Dynamic catalog grids and filters (separate storefront slices).

**Status:** Active (hero slice)  
**Version:** 1.0
