# djn-store

ARPG virtual goods e-commerce (Path of Exile, Diablo 4, Last Epoch, Hero Siege, Torchlight Infinite). Next.js (App Router), PostgreSQL, Prisma, Clerk. Domain and workflows live under `docs/mhp` and `docs/rules`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
```

Copy `.env.example` to `.env` and set `DATABASE_URL` and Clerk keys before running migrations or the app.

**Google Stitch (MCP):** configure GCP + replace `REPLACE_ME_GCP_PROJECT_ID` in [`.cursor/mcp.json`](.cursor/mcp.json), then restart Cursor. Full steps: [`docs/mcp/stitch-setup.md`](docs/mcp/stitch-setup.md).

## Architecture

API route handlers stay thin (Zod + service calls). Business logic in `src/features/*/`.service.ts; Prisma only in `*.repository.ts`.
