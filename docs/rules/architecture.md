# Architecture

This is an **e-commerce platform** focused on **virtual items for ARPG titles** (Path of Exile 1 & 2, Diablo 4, Last Epoch, Hero Siege, Torchlight Infinite), with a **Gamer Dark** storefront, **advanced catalog filters**, **checkout**, and an **admin panel** for real-time stock and pricing, orders, and sales visibility—as defined in **`docs/mhp/overview.md`**.

> **Migration note:** The previous documentation described a **multi-tenant SaaS** model (many independent stores per user). That design is **not in scope** for this product; logical isolation is **by game / catalog and business rules**, not by tenant `storeId`.

---

## 🛠️ Tech Stack

### Frontend

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **UI Library**: shadcn/ui
* **Styling**: Tailwind CSS
* **Form management**: React Hook Form
* **Validation**: Zod

---

### Backend

* **Runtime**: Node.js (via Next.js)
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: Clerk
* **API**: Next.js Route Handlers (`/api`)

---

### Infrastructure (Optional / Future)

* **Hosting**: Vercel
* **Database**: PostgreSQL (Neon or local)
* **File Storage**: (future) S3
* **Monitoring**: (future) Sentry

---

## 📁 Project Structure

The project follows a **feature-oriented and layered structure**.

```bash
/src
  /app
    /(public)
      page.tsx
      /games/[gameSlug]
        page.tsx

    /(dashboard)
      /admin
      /products
      /orders

  /components
    /ui
    /shared
    /forms
    /store

  /lib
    prisma.ts
    auth.ts
    utils.ts

  /server
    /services
    /repositories

  /api

  /types
  /schemas

/docs
  /mhp
    overview.md
    /features
      /authentication
        feature.md
      /catalog
        feature.md
      /product
        feature.md
      /order
        feature.md
      /admin
        feature.md
```

---

### Structure Rules

* UI components must NOT contain business logic
* Services must NOT access Prisma directly
* Repositories are the ONLY layer allowed to use Prisma
* API routes must be thin (validation + service calls)
* Each feature must be isolated

---

## 🧠 Feature Documentation Strategy

Each feature MUST have its own documentation file.

### Structure

```bash
/docs/mhp/features/{feature-name}/feature.md
```

### Rules

* Must be created BEFORE or DURING development
* Must include:

  * Purpose
  * Flows
  * Business rules
  * Dependencies
* Must always be updated

### Purpose

* Provide context to AI
* Avoid logic loss
* Serve as feature-level source of truth

---

## 🎯 System Design Principles

* The system starts simple and evolves
* **Catalog organisation by supported game** is a first-class concern (aligned with **`docs/mhp/overview.md`**)
* Operational data (stock, prices, orders) must remain consistent with catalog and checkout rules
* Simplicity over complexity
* AI-friendly architecture:

  * predictable structure
  * low abstraction
  * strong documentation

---

## 🗄️ Database

### Schema Structure

* Source: `schema.prisma`
* Reference:

  * `data-model.md`
  * `business-logic.md`

---

## 🔄 Data Flow Architecture

### Client-Server Communication

* API via Next.js route handlers
* Forms submit to `/api/*`

---

### Database Access Pattern

* Prisma used ONLY in repositories
* Services handle business logic

---

## 🔐 Security Architecture

### Authentication & Authorization

* Clerk handles authentication
* **Administrative** routes (stock, prices, orders, dashboards) require authenticated, authorised users

---

### Data Security

* Validation: Zod
* SQL injection: prevented by Prisma
* Secrets via environment variables

---

## 🏪 Multi-tenancy

**Current ARPG scope (`docs/mhp/overview.md`):** there is no SaaS multi-tenancy (no per-user independent stores). The migration note at the top replaces that design. Instead of isolation by tenant `storeId` / `slug`, the following applies.

### Game and catalog context

* Supported titles and catalog segmentation follow **`docs/mhp/overview.md`** (ARPG list and UX pillars).
* The model must support **browsing and filtering by game** and **item attributes** required for the storefront, without assuming per-seller tenant “stores”.

### Guarantees

* **No inappropriate leakage** across games or catalog contexts when business rules require separation (e.g. listing or pricing).
* **Consistency** between published catalog, stock, and order lines.

---

## ⚡ Performance Considerations

### Frontend

* Use Next.js optimizations
* Keep components small

---

### Backend

* Index by keys used in listings and admin queries (e.g. **game** / category identifiers and common filter fields—exact columns defined in schema)
* Keep queries simple

---

## 🔧 Development Workflow

### Code Quality

* ESLint + Prettier
* TypeScript strict mode

---

## 🚫 Architectural Constraints

The system must NEVER:

* Access DB outside repositories
* Put business logic in UI
* **Blur game/catalog context** when rules require separation
* Skip validation
* Trust frontend data

---

## ✅ Final Principle

> This architecture must guide all implementation decisions.
> If code contradicts this document, the code is wrong.

---

**Status:** Active
**Type:** Architecture Definition
**Version:** 1.0
