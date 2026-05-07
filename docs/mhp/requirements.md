# 📋 Requirements

**ARPG virtual goods e-commerce — full-stack web app**

This document defines **what the system must do** from a business and user perspective. Product intent and scope are defined in **`docs/mhp/overview.md`**.

> This platform is a **single** ARPG-focused storefront with an **admin operations panel**, not a multi-tenant “create your store” SaaS.

---

## 🎯 1. Product vision

Build a **full-stack web application** that:

- Presents a **Gamer Dark**, trustworthy storefront for **virtual items** across the **supported games** listed in **`docs/mhp/overview.md`**
- Lets customers **discover items** with **per-game** structure and **filters**
- Supports a **cart** and **checkout** flow
- Gives operators an **admin panel** for **stock**, **pricing**, **orders**, **delivery status**, and a **sales dashboard**
- Supports **information architecture** for **in-game delivery** methods and **onboarding** copy for new users (content and IA per **`docs/mhp/overview.md`**)

---

## 👥 2. Users & roles

### Visitors (unauthenticated)

- Browse the storefront and per-game catalog
- Use **filters** as provided
- Add items to cart and proceed through checkout (guest path allowed unless specified otherwise in `business-logic.md`)

### Customers (optional authenticated)

- Same storefront capabilities; identity only if required by checkout or future features (see `business-logic.md`)

### Admin operators (authenticated via Clerk)

- Access the **admin panel**
- Manage **stock** and **prices** (including frequent updates)
- Manage **orders** and **delivery / fulfillment status**
- View **sales / dashboard** summaries

---

## 🧩 3. Core use cases

### Visitors / customers

- View storefront and per-game catalog
- Filter catalog by **game**, **item type**, and attributes as designed
- View product detail
- Manage cart and **checkout**

### Admin operators

- Sign in via **Clerk**
- Adjust **stock** and **prices**
- List and inspect **orders**
- Update **order / delivery status** through fulfillment
- View high-level **sales** metrics

---

## 🔐 4. Authentication requirements

- Authentication via **Clerk**
- **Admin** areas require authenticated, authorized users
- Session handling must be secure (see `architecture.md`)

---

## 🎮 5. Catalog & game context

The system must:

- Support the **games** listed in **`docs/mhp/overview.md`**
- Organize navigation and catalog **by game** and support **advanced filtering** (item type and game-relevant attributes)
- Show only **active / sellable** catalog entries per `business-logic.md`

---

## 🛍️ 6. Product & inventory (admin)

Admin operators must be able to:

- Create, update, and retire catalog items as defined in `data-model.md` / `business-logic.md`
- Maintain **price** and **stock** with rules for real-time economic volatility (see **`docs/mhp/overview.md`**)

Customers must be able to:

- Browse and open product detail for purchasable items

---

## 🛒 7. Cart requirements

Customers must be able to:

- Add products to cart
- Update quantities
- Remove lines

The system must:

- Support a **session-based** cart where guests can shop (unless `business-logic.md` states otherwise)
- Enforce **stock** rules before checkout

---

## 📦 8. Checkout requirements

Customers must be able to:

- Complete checkout with required purchase fields
- Receive confirmation consistent with order state (see `business-logic.md`)

The system must:

- Compute totals correctly
- Create orders and reserve or adjust **stock** per `business-logic.md`
- **Payment handling** is defined in `business-logic.md` (not fully specified in **`docs/mhp/overview.md`**)

---

## 📋 9. Order & fulfillment requirements

Admin operators must be able to:

- View orders and details
- Track and update **delivery / fulfillment status** for in-game delivery (see **`docs/mhp/overview.md`**)

The system must:

- Preserve order history and integrity
- Prevent changes that violate `business-logic.md` (e.g. completed orders)

---

## 📊 10. Dashboard requirements

Admin operators must be able to view summary metrics appropriate to the business (e.g. orders, revenue), as detailed in feature specs.

---

## 📚 11. Information & trust content

Per **`docs/mhp/overview.md`**, the product must provide:

- Guidance on **in-game delivery** methods
- Clear explanations for **new users** (how the site works)

---

## 📱 12. Non-functional requirements

The system should:

- Be fast and responsive
- Scale with **catalog size** and traffic for a **single** platform (not multi-store tenancy)
- Keep catalog and order data **consistent** across games where rules require separation
- Prioritize usable, trustworthy UX (**Gamer Dark** and clarity)
- Be secure (auth, validation, data protection — see `architecture.md`)

---

## 🔮 13. Future enhancements

- Additional payment integrations
- Richer analytics and reporting
- Notifications (order / delivery updates)
- Deeper attribution filters per game title

---

## ✅ 14. Final note

> This document defines **what** the system does.  
> **`docs/mhp/overview.md`** is the product context; **business logic** and **data model** refine rules and entities.

---

**Status:** Initial  
**Type:** Requirements Specification  
**Version:** 1.0
