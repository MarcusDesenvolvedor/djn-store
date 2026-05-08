# Feature: Admin category creation

## Purpose

Permitir que staff autenticado cadastre **categorias de catálogo** com **nome** apenas, para uso em produtos e filtros futuros; e **excluir** categorias sem produtos vinculados.

## Flows

1. Acessa `/admin/categorias`.
2. Preenche o nome e envia **POST** `/api/admin/categories` (Zod no handler → serviço → repositório).
3. Opcional: **DELETE** `/api/admin/categories/{categoryId}` quando não houver produtos na categoria (`409` se houver vínculos).
4. Lista atualizada na mesma página.

## Business rules

- **Nome** obrigatório, não vazio; tamanho máximo definido no schema Zod.
- **Exclusão** só permitida se **nenhum** produto referenciar a categoria (`productCount === 0`).
- Endpoints `/api/admin/*`: sessão Clerk + `requireAdminApiSession`.

## Entities involved

- `Category`, `Product` (Prisma).

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/categories` | Admin |
| POST | `/api/admin/categories` | Admin |
| DELETE | `/api/admin/categories/{categoryId}` | Admin |

Respostas: sucesso `{ "data": ... }`; erro `{ "error": "message" }`.

## Dependencies

- Clerk, Prisma, feature `admin` (gate).

**Status:** Active  
**Version:** 1.1
