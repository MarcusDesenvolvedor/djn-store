# 🗂️ Data Model

**ARPG virtual goods e-commerce**

This document defines the **domain data model**, including:

- Entities
- Attributes
- Relationships
- Aggregates
- Invariants

This model is **technology-agnostic**, but designed to map cleanly to PostgreSQL + Prisma. Product scope comes from **`docs/mhp/overview.md`**.

---

## 🎯 1. Purpose

The data model aims to:

- Represent all business entities for a **single** ARPG storefront (no tenant `Store` root)
- Scope catalog data by **supported game** and categories
- Guide Prisma schema creation
- Support API and feature design

---

## 🧩 2. Core aggregates

The system is organized around:

- **User aggregate** → identity (external via Clerk); optional link from orders
- **Game aggregate** → supported title (Path of Exile, Diablo 4, etc.)
- **Category aggregate** → grouping per game (item types / filters)
- **Product aggregate** → sellable virtual item
- **Order aggregate** → purchase and fulfillment
- **Cart aggregate (session-based)** → pre-checkout selection

---

## 👤 3. User aggregate

### Root: User

Represents an authenticated user synced with Clerk (admin and/or customer, per deployment rules).

**Attributes:**

- id (UUID or Clerk user id strategy per implementation)
- email
- createdAt

**Relationships:**

- User _has many_ Orders (optional; guest orders may omit user)

**Rules:**

- Authentication is external (Clerk)

---

## 🎮 4. Game aggregate

### Root: Game

Represents a supported ARPG title from **`docs/mhp/overview.md`**.

**Attributes:**

- id (UUID)
- name
- slug (unique, URL-safe)

**Relationships:**

- Game _has many_ Categories
- Game _has many_ Products

**Rules:**

- Slug must be unique
- Products and categories for one game must not violate cross-game isolation rules in `business-logic.md`

---

## 🗂️ 5. Category aggregate

### Root: Category

Groups products within a **single** game.

**Attributes:**

- id (UUID)
- gameId
- name
- createdAt

**Relationships:**

- Category _belongs to_ Game
- Category _has many_ Products

**Rules:**

- Category name is unique **per game** (not globally), unless `business-logic.md` states otherwise

---

## 🛍️ 6. Product aggregate

### Root: Product

Represents a sellable virtual item listed on the platform.

**Attributes:**

- id (UUID)
- gameId
- categoryId
- name
- description
- price
- stock
- brand? (optional)
- isActive
- createdAt
- updatedAt

**Relationships:**

- Product _belongs to_ Game
- Product _belongs to_ Category
- Product _has many_ Images
- Product _has many_ OrderItems

**Rules:**

- Price must be > 0
- Stock must be ≥ 0
- Only active products are publicly purchasable
- Attribute fields needed for storefront filters extend this model as defined in features/schemas

---

## 🖼️ 7. ProductImage

**Attributes:**

- id (UUID)
- productId
- url
- createdAt

**Relationships:**

- Belongs to Product

---

## 🛒 8. Cart aggregate

### Root: Cart

Session-based cart (persisted or not, per implementation).

**Attributes:**

- id (UUID or session identifier)
- (optional) userId for logged-in shoppers

**Relationships:**

- Cart _has many_ CartItems

### CartItem

**Attributes:**

- id
- cartId
- productId
- quantity

**Rules:**

- Quantity ≥ 1
- Must not exceed available stock

---

## 📦 9. Order aggregate

### Root: Order

Represents a purchase placed through checkout.

**Attributes:**

- id (UUID)
- userId? (nullable for guest)
- status (see `business-logic.md` — payment and fulfillment lifecycle)

**Customer info** (or normalized profile if refactored later):

- firstName
- lastName
- street
- number
- city
- state
- country
- identificationNumber
- phone

**Metadata:**

- totalAmount
- createdAt

**Relationships:**

- Order _has many_ OrderItems
- Order _optionally has_ Payment
- Order _optionally belongs to_ User

### OrderItem

**Attributes:**

- id (UUID)
- orderId
- productId
- quantity
- priceAtPurchase

**Rules:**

- priceAtPurchase is a snapshot at checkout
- Quantity ≥ 1

---

## 💳 10. Payment

Represents payment state for an order (exact method per `business-logic.md`; not prescribed in **`docs/mhp/overview.md`**).

**Attributes:**

- id (UUID)
- orderId
- status (e.g. PENDING | CONFIRMED, per implementation)
- createdAt
- confirmedAt?

---

## 🧭 11. Key relationships overview

- Game → Categories → many
- Game → Products → many
- Product → OrderItems → many
- Order → OrderItems → many
- Order → Payment → optional one
- User → Orders → many (optional)

---

## 🧾 12. Invariants (critical)

These must **always** hold:

- No Product without Game
- No Product without Category
- No Category without Game
- No OrderItem without Order
- No cross-game mistakes in relationships (OrderItems reference Products; Products carry gameId)
- Cart line quantities respect stock
- Stock must never be negative

---

## 🚫 13. Forbidden structures

The system must never allow:

- Product referencing a Category from another Game
- Orders without line items
- Orphaned OrderItems
- Negative stock

---

## ✅ 14. Final note

> This model defines **what exists** and **how entities relate**.  
> It must stay consistent with **`business-logic.md`**.

---

**Status:** Active  
**Type:** Domain Data Model  
**Version:** 1.0
