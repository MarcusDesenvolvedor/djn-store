# Feature: Admin product creation

## Purpose

Permitir que staff autenticado (Clerk + regras admin) **cadastre produtos** no catálogo ARPG: vínculo obrigatório a **Category**, ID numérico sequencial gerado pelo banco, preço e estoque conforme `docs/mhp/data-model.md`. Categorias são mantidas pela feature **category-admin**.

## Flows

### Criar produto (admin UI)

1. Acessa `/admin/produtos/novo` (área admin já protegida pelo layout).
2. Preenche categoria (lista por nome), nome, descrição, preço, estoque, marca opcional, ativo.
3. **POST** `/api/admin/products` com JSON validado (Zod no handler → serviço → repositório).
4. Sucesso → lista em `/admin/produtos`.

### Listar categorias (admin API)

- **GET** `/api/admin/categories` → `{ "data": { id, name, createdAt }[] }` para popular o formulário de produto (implementação em `category-admin`).

### Listar produtos (admin API)

- **GET** `/api/admin/products` → `{ "data": ProductRow[] }` para a grade da lista.

## Business rules

- **ID do produto:** inteiro autoincremental (1, 2, 3…), não enviado pelo cliente.
- **Categoria** obrigatória e deve existir (`categoryId` validado no serviço).
- **Preço** > 0; **estoque** ≥ 0 (`data-model.md`).
- Endpoints `/api/admin/*`: sessão Clerk + mesma regra de admin que o layout (`requireAdminApiSession`).

## Entities involved

- `Product`, `Category` (Prisma).

## API endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/admin/products` | Admin |
| GET | `/api/admin/products` | Admin |
| GET | `/api/admin/categories` | Admin |

Respostas: sucesso `{ "data": ... }`; erro `{ "error": "message" }`.

## UI behavior

- Formulário: React Hook Form + Zod (`product-admin.schema.ts`), tema Stitch dos tokens existentes.
- **Camadas:** handler só valida + gate; lógica em `product-admin.service.ts`; Prisma só em `product-admin.repository.ts`.

## Dependencies

- Clerk, Prisma, feature `admin` (gate), categorias via API compartilhada.

## Out of scope (current slice)

- Upload de imagens (`ProductImage`), edição PATCH/DELETE, filtros avançados na lista.

**Status:** Active (create + list + categories feed)  
**Version:** 1.2
