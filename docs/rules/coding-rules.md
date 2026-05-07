# 🧩 Coding Rules

**ARPG virtual goods e-commerce** — see `docs/mhp/overview.md` and `architecture.md`

This document defines the **mandatory coding standards, principles, and conventions**.

All code must follow these rules. Any violation must be refactored.

---

## 🎯 1. Purpose

The goals are:

* Ensure consistency across the codebase
* Reduce bugs and technical debt
* Align implementation with Architecture and Business Logic
* Make the system predictable for AI generation

---

## 🧠 2. Core Principles

All code must follow:

* Clean Code
* SOLID
* KISS
* DRY
* YAGNI
* Explicit over implicit

> Code must be predictable and easy to understand.

---

## 🧱 3. General Rules

* Use **TypeScript** everywhere
* Never use `any`
* Prefer immutability
* Functions must:
  * Be small
  * Do one thing
* Avoid side effects
* No unused code
* No commented-out code
* No TODOs without context

---

## 📝 4. Naming Conventions

* Variables/functions: `camelCase`
* Types/interfaces: `PascalCase`
* Constants: `UPPER_SNAKE_CASE`
* Files: `kebab-case.ts`
* React components: `PascalCase.tsx`

Names must be:

* Descriptive
* In English
* Based on domain

---

## 🗂️ 5. Project Structure Rules

Follow `architecture.md`.

Rules:

* No circular dependencies
* Each layer has one responsibility
* Feature-specific code must stay isolated
* Shared logic goes to shared folders

---

## 🧠 6. Feature Documentation Rule (CRITICAL)

Every feature MUST have a documentation file:

```
/docs/mhp/features/{feature-name}/feature.md
```

---

### Requirements:

* Must be created BEFORE or DURING development
* Must include:

  * Purpose
  * Flows
  * Business rules
  * Dependencies

---

### Maintenance:

* Must always be updated when:

  * logic changes
  * flows change

---

### Purpose:

* Prevent AI from losing context
* Keep logic centralized
* Serve as feature-level source of truth

---

## ⚙️ 7. Backend Rules (Next.js)

### 7.1 API Routes

* Must:

  * Receive request
  * Validate input (Zod)
  * Call service
  * Return response

* Must NOT:

  * Contain business logic
  * Access Prisma directly

---

### 7.2 Services

* Contain business logic

* Must:

  * Enforce rules from `business-logic.md`
  * Be simple and explicit

* Must NOT:

  * Access database directly

---

### 7.3 Repositories

* Responsible for Prisma access

* Must:

  * Only perform DB operations

* Must NOT:

  * Contain business logic

---

## 🎨 8. Frontend Rules (React + Next.js)

### 8.1 Components

* Must be:

  * Small
  * Reusable
  * Focused on UI

* Must NOT:

  * Contain business logic

---

### 8.2 State

* Use local state for UI
* Avoid unnecessary global state

---

### 8.3 Forms

* Use React Hook Form
* Validate before submit
* Show clear errors

---

## 🔐 9. Security Rules

* Never trust frontend data
* Always validate input
* Never expose sensitive data
* Use environment variables for secrets

---

## 🧾 10. Error Handling

* Never ignore errors
* Errors must:

  * Be explicit
  * Have clear messages

---

## 🧹 11. Formatting & Linting

* Use ESLint
* Use Prettier
* Code must pass lint before commit

---

## 🚫 12. Forbidden Practices

The system must NEVER:

* Use `any`
* Put business logic in UI
* Access DB outside repositories
* Skip validation
* Duplicate logic
* Break architecture rules

---

## 🤖 13. AI Development Rules (CRITICAL)

When generating code, AI MUST:

* Follow folder structure strictly
* Respect layer separation:

  * API → Service → Repository
* NEVER:

  * create new patterns without reason
  * duplicate logic
  * ignore existing services

---

### Before writing code, AI must:

* Check:

  * `docs/mhp/overview.md`
  * `business-logic.md`
  * `data-model.md`
  * `feature.md` (if exists)

---

### When creating new features:

* MUST create:

  * `feature.md`
  * service
  * repository
  * API route

---

## ✅ 14. Final Principle

> If code violates these rules, it must be refactored.

---

**Status:** Active
**Type:** Coding Standards
**Version:** 1.0
