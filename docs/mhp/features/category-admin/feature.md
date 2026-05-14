# Feature: Admin category creation

## Purpose

Permitir que staff autenticado cadastre e organize **categorias de catálogo** em **árvore** (pai/subcategorias), com **nome** e **URL de imagem opcional** por nó; **editar** nó; **excluir** apenas quando não houver produtos nem subcategorias filhas.

## Flows

1. Acessa `/admin/categorias`.
2. **Lista em árvore** (GET interno/admin): níveis expansíveis, ações rápidas por linha (**+** subcategoria, **Editar**, **Excluir**).
3. **“Adicionar categoria raiz”** (`parentId` ausente ou `null` no POST).
4. **Subcategoria** via **POST** `/api/admin/categories` incluindo `parentId` (UUID da categoria pai).
5. **PATCH** `/api/admin/categories/{categoryId}` com subconjunto de `name`, `imageUrl`.
6. **DELETE** `/api/admin/categories/{categoryId}` se `productCount = 0` e `childCount = 0` (`409` com produtos ou subcategorias).

## Business rules

- **Nome** obrigatório ao criar; **`imageUrl`** opcional mas, se enviado, URL `http(s)` válida; limites nos schemas Zod.
- **`parentId`** opcional: omitido ⇒ categoria raiz; UUID válido ⇒ deve existir (senão erro no boundary).
- **Exclusão** bloqueada com produtos ou com filhos na hierarquia.
- Endpoints `/api/admin/*`: sessão Clerk + `requireAdminApiSession`. Sem regra de negócio nos handlers além da validação Zod.

## Entities involved

- `Category` (`parentId` auto-relacionamento), `Product` (Prisma).

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/categories` | Admin — `{ "data": árvore[] }`; opcional `?flat=1` ⇒ lista plana para selects |
| POST | `/api/admin/categories` | Admin — corpo `{ name, imageUrl?, parentId? }` |
| PATCH | `/api/admin/categories/{categoryId}` | Admin |
| DELETE | `/api/admin/categories/{categoryId}` | Admin |

Respostas: sucesso `{ "data": ... }`; erro `{ "error": "message" }`.

## Dependencies

- Clerk, Prisma, feature `admin` (gate).

**Status:** Active  
**Version:** 1.2
