# 🔄 Workflow — Frontend Development

**ARPG virtual goods e-commerce** — see `docs/mhp/overview.md` and `architecture.md`

This document defines the **workflow and rules** for developing frontend code using **Next.js + React + TypeScript**.

It must be followed whenever creating or modifying pages, components, or client-side logic.

---

## 🎯 1. Purpose

Ensure that the frontend:

* Reflects Business Logic and Features
* Respects Architecture boundaries
* Follows Coding Rules
* Is consistent and maintainable
* Integrates correctly with the API

---

## 🧱 2. Technology Context

This workflow assumes:

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* Fetch API (or simple abstraction)

---

## 📌 3. Before Writing UI Code

Before implementing any UI, you MUST have:

* The **feature.md**
* Access to:

  * `docs/mhp/overview.md`
  * `business-logic.md`
  * `data-model.md`
  * `architecture.md`
  * `coding-rules.md`
  * `workflow-api-endpoint.md`

❗ Never build UI without feature context.

---

## 📁 4. Frontend Structure

Follow `architecture.md`.

---

### Rules:

* UI must be separated into:

  * Pages (routing)
  * Components (UI)
* Feature-specific components go inside `/components/store` or similar
* Shared components go inside `/components/shared`
* No business logic in UI

---

## 🛠️ 5. Frontend Creation Steps

---

### Step 1 — Identify UI Flows

Define:

* Pages
* User actions
* Navigation flow

Map actions to API endpoints.

---

### Step 2 — Define Types & Schemas

* Create TypeScript types:

  * API responses
  * View models
* Use Zod for:

  * Form validation
  * Optional response validation

---

### Step 3 — Implement API Calls

* Use `fetch` or small helper
* Keep calls simple and reusable

Example:

```ts id="api-call"
export async function getProducts() {
  const res = await fetch('/api/products')
  return res.json()
}
```

---

### Step 4 — Implement Pages

Pages must:

* Call API functions
* Handle navigation
* Pass data to components

---

### Must NOT:

* Contain business logic
* Directly manipulate data rules

---

### Step 5 — Implement Components

Components must:

* Be presentational
* Receive data via props
* Be reusable

---

### Must NOT:

* Call API directly
* Contain business logic

---

### Step 6 — Forms

Use:

* React Hook Form
* Zod validation

Rules:

* Validate before submit
* Show field errors
* Prevent invalid submission

---

### Step 7 — State Management

* Use local state (`useState`) for UI only
* Do NOT duplicate server data unnecessarily
* Avoid global state unless required

---

### Step 8 — Loading & Error Handling

Always handle:

* Loading state
* Error state

---

### UI Feedback:

* Loading → spinner/skeleton
* Error → clear message
* Success → feedback (toast/message)

---

## 🔐 6. Authentication Rules

* Use Clerk components/hooks
* Protect dashboard routes
* Redirect unauthenticated users

---

## 🏪 7. Multi-Tenancy in Frontend

**ARPG scope:** there are no per-tenant seller stores. Treat this section as **routing and catalog context**:

* The public storefront is organised by **supported game** (e.g. `gameSlug` routes, aligned with `architecture.md`).
* The **admin panel** is protected (Clerk); management routes must not expose operational data without authentication and authorization.

Example public route (illustrative):

```
/games/{gameSlug}
```

---

## 🧾 8. Data Integrity Rules

* Never trust frontend state
* Always rely on API for truth
* Never implement business rules in UI

---

## ❌ 9. Forbidden Practices

* API calls inside components
* Business logic in UI
* Using `any`
* Hardcoding rules
* Duplicating API logic
* Ignoring validation

---

## 🧪 10. Validation Checklist

Before finishing:

* [ ] UI matches feature.md
* [ ] API calls implemented
* [ ] Forms validated
* [ ] Errors handled
* [ ] Loading states handled
* [ ] No business logic in UI
* [ ] Lint passes

---

## 🏁 11. Final Principle

> The frontend displays data and triggers actions.
> It must never decide business rules.

---

**Status:** Active
**Type:** Frontend Workflow
**Version:** 1.0
