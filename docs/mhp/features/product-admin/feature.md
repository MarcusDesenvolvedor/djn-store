# Feature: Admin product creation

## Purpose

Permitir que staff autenticado (Clerk + regras admin) **cadastre produtos** no catálogo ARPG: SKU único, vínculo obrigatório a **Game** e **Category** da mesma árvore, preço e estoque conforme `docs/mhp/data-model.md`.

## Flows

### Criar produto (admin UI)

1. Acessa `/admin/produtos/novo` (área admin já protegida pelo layout).
2. Preenche SKU, jogo, categoria (carregada por jogo), nome, descrição, preço, estoque, marca opcional, ativo.
3. **POST** `/api/admin/products` com JSON validado (Zod no handler → serviço → repositório).
4. Sucesso → lista em `/admin/produtos`.

### Listar categorias por jogo (admin API)

- **GET** `/api/admin/categories?gameId={uuid}` → `{ "data": CategoryRow[] }` para popular o formulário.

### Listar produtos (admin API)

- **GET** `/api/admin/products` → `{ "data": ProductRow[] }` para a grade da lista.

## Business rules

- **SKU:** único globalmente; normalizado para **maiúsculas** no serviço antes do insert.
- **Categoria** deve pertencer ao **mesmo** `gameId` informado (validação no serviço).
- **Preço** > 0; **estoque** ≥ 0 (`data-model.md`).
- Endpoints `/api/admin/*`: sessão Clerk + mesma regra de admin que o layout (`requireAdminApiSession`).

## Entities involved

- `Product`, `Category`, `Game` (Prisma).

## API endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/admin/products` | Admin |
| GET | `/api/admin/products` | Admin |
| GET | `/api/admin/categories?gameId=` | Admin |

Respostas: sucesso `{ "data": ... }`; erro `{ "error": "message" }`.

## UI behavior

- Formulário: React Hook Form + Zod (`product-admin.schema.ts`), tema Stitch dos tokens existentes.
- **Camadas:** handler só valida + gate; lógica em `product-admin.service.ts`; Prisma só em `product-admin.repository.ts`.

## Dependencies

- Clerk, Prisma, feature `admin` (gate).

## Out of scope (current slice)

- Upload de imagens (`ProductImage`), edição PATCH/DELETE, filtros avançados na lista.

**Status:** Active (create + list + categories feed)  
**Version:** 1.0
