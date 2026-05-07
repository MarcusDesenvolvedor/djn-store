# 🧠 Business Logic

**ARPG virtual goods e-commerce**

This document defines **business rules, constraints, and behaviors** for the platform.

It is a **source of truth** for implementation. Anything that contradicts it (and **`docs/mhp/overview.md`**) is wrong.

---

## 🎯 1. System purpose

The system:

- Sells **virtual items** for the **supported ARPG games** in **`docs/mhp/overview.md`**
- Presents a **Gamer Dark**, trust-focused storefront with **per-game** navigation and **filters**
- Provides **cart** and **checkout**
- Gives **admin operators** tools for **stock**, **pricing**, **orders**, **fulfillment / delivery status**, and **sales visibility**

There is **no** SaaS multi-tenancy: no per-user “stores” or tenant `storeId` isolation.

---

## 👤 2. Actors

### 2.1 Admin operator (authenticated via Clerk)

- Manages catalog, stock, prices, orders, and fulfillment
- Uses the **admin panel** and dashboard

### 2.2 Visitor / customer

- Browses catalog and product detail
- Uses cart and checkout
- May be **guest** or **authenticated**, depending on feature choices (defaults below allow guest cart unless you tighten it in features)

---

## 🎮 3. Game & catalog rules

- Every **Product** belongs to exactly **one Game** and **one Category** within that game.
- Supported games are exactly those in **`docs/mhp/overview.md`** (implemented as `Game` rows or equivalent).
- **Categories** group products **within a game** for navigation and filters.
- Catalog and filters must respect **game context**: listings and admin operations must not mix games against these rules.

---

## 🛍️ 4. Product rules

- Products have: name, description, price **> 0**, stock **≥ 0**, category, optional brand, optional images.
- **Active** products are visible and purchasable; inactive are not sold.
- Stock must **never** go negative.
- Stock and price updates in admin apply immediately for new checkouts (subject to concurrency rules in implementation).

---

## 🗂️ 5. Category rules

- A category belongs to **one game**.
- Names are unique **per game** unless a feature explicitly relaxes that.

---

## 🛒 6. Cart rules

- Cart is **session-based**; guests may hold a cart.
- Cart lines reference **Products**; quantities **≥ 1** and **≤ available stock**.
- All items must remain valid (still active, same game constraints) at checkout; invalid lines must be rejected or corrected per API design.

---

## 📦 7. Order rules

- An **Order** contains one or more **OrderItems** with **snapshot** `priceAtPurchase`.
- Order carries **customer** fields required for fulfillment (see `data-model.md`).
- **Order status** covers at least:
  - **PENDING_PAYMENT** — created, awaiting payment confirmation
  - **PAID** — payment confirmed; fulfillment may start
  - **FULFILLING** — in-game delivery in progress (virtual goods)
  - **DELIVERED** — delivery completed
  - **CANCELED** — canceled per rules below

(Adjust enum names in Prisma to match; behavior must preserve this lifecycle.)

---

## 💳 8. Payment rules

- **`docs/mhp/overview.md`** does not mandate a specific payment provider.
- Default documented behavior: payment is **confirmed** through an implementation-defined flow (manual, gated, or integrated). Until confirmed, order stays **PENDING_PAYMENT**.
- When payment is **confirmed**: transition to **PAID** and apply **stock deduction** if not already reserved (pick exactly one strategy—reserve on order create vs deduct on pay—and document it in the order feature).

---

## 📉 9. Stock rules

- Validate stock on **add-to-cart** and **checkout** (and on payment if reservation model).
- On successful payment (or reservation commitment), **reduce** stock so it never falls below zero.
- Admin may **increase** stock; decreases happen through sales or manual correction per admin rules.

---

## 📋 10. Fulfillment & admin order rules

- Admin can **list** and **inspect** all orders.
- Admin updates **FULFILLING → DELIVERED** when in-game delivery is complete (**`docs/mhp/overview.md`**).
- Orders are **immutable** in terms of line items after confirmation; only **status** (and controlled fulfillment fields) may change per feature design.
- Historical integrity: do not delete orders; use **CANCELED** where allowed.

---

## 🔐 11. Access control rules

- **Admin** routes require authenticated, authorized Clerk users.
- **Public** catalog and cart routes do not expose admin-only data.
- API must not return another customer’s orders without authorization.

---

## 🌐 12. Routing context (conceptual)

- Public catalog is organized by **game** (e.g. `/games/{gameSlug}` — illustrative; see `architecture.md`).
- Admin lives under protected dashboard routes.

---

## 🚫 13. Forbidden behaviors

The system must never:

- Treat the platform as multi-tenant **store** SaaS (no cross-tenant store leakage—there are no tenant stores).
- Mix **game/catalog** context in violation of these rules.
- Allow **negative stock**
- Confirm checkout with invalid customer data or zero line items
- Expose operational admin data anonymously

---

## 🧾 14. Data consistency rules

- Every product has a **game** and **category** from that game.
- Every order line references a product consistent with catalog rules at the time of purchase snapshot.
- No orphan **OrderItems**

---

## 🔄 15. Evolution rules

Future changes must not break:

- Game/catalog integrity
- Order and payment integrity
- Stock non-negativity

---

## ✅ 16. Final principle

> If the code contradicts this document or **`docs/mhp/overview.md`**, the code is wrong.

---

**Status:** Active  
**Type:** Business Source of Truth  
**Version:** 1.0