# Feature: Admin product creation



## Purpose



Permitir que staff autenticado (Clerk + regras admin) **cadastre produtos** no catálogo ARPG: vínculo obrigatório a **Category folha** (último nível da árvore), ID numérico sequencial gerado pelo banco, preço e estoque conforme `docs/mhp/data-model.md`. Categorias são mantidas pela feature **category-admin**.



## Flows



### Criar produto (admin UI)



1. Acessa `/admin/produtos/novo` (área admin já protegida pelo layout).

2. Escolhe **categoria folha** por modal (`GET /api/admin/categories` em formato árvore): apenas nós sem filhos são selecionáveis; intermediários aparecem desabilitados com texto de ajuda.

3. Preenche nome, descrições (curta obrigatória, longa rich opcional), preços, estoque consolidado ou **variantes** com estoque por linha (opcional).

4. **POST** `/api/admin/products` com JSON validado (Zod no handler → serviço → repositório). Payload **não** inclui SKU principal nem campos logísticos/EAN/unidade — SKU principal é sempre gerado no servidor (`AUTO-…`).

5. Sucesso → lista em `/admin/produtos`.



### Listar categorias (admin API)



- **GET** `/api/admin/categories` → árvore `{ "data": CategoryTreeNode[] }` para o modal de produto.

- **GET** `/api/admin/categories?flat=1` → lista plana (tooling / outros fluxos em category-admin).



### Listar produtos (admin API)



- **GET** `/api/admin/products` → `{ "data": ProductRow[] }` para a grade da lista.



## Business rules



- **ID do produto:** inteiro autoincremental (1, 2, 3…), não enviado pelo cliente.

- **Categoria** obrigatória, deve existir e ser **folha** (sem categorias filhas). Validado no serviço/repositório.

- **SKU principal:** sempre definido no servidor na criação; cliente não envia.

- **Preço** > 0; **estoque** ≥ 0 (`data-model.md`). Com **variantes**, o estoque persistido no produto é a **soma** dos estoques das variantes.

- Endpoints `/api/admin/*`: sessão Clerk + mesma regra de admin que o layout (`requireAdminApiSession`).

- **Variantes:** opcional; modelo `ProductVariant` com `attributes` JSON, `salePrice` opcional, `stock` inteiro; SKU por variante opcional e único por produto quando informado.



## Entities involved



- `Product`, `Category`, `ProductVariant`, `ProductImage` (Prisma).



## API endpoints



| Method | Path | Auth |

|--------|------|------|

| POST | `/api/admin/products` | Admin |

| GET | `/api/admin/products` | Admin |

| GET | `/api/admin/categories` (árvore) ou `/api/admin/categories?flat=1` (plano) | Admin |



Respostas: sucesso `{ "data": ... }`; erro `{ "error": "message" }`.



### Breaking / compatibilidade de payload (POST produto)



- **Removidos** do contrato público de criação: `sku`, `barcode`, `weightKg`, dimensões de envio, `measureUnit` (colunas permanecem no banco com defaults / null quando aplicável).

- **Novos:** `variants` (array opcional, default `[]`). Cada item: `{ sku?, attributes (record não vazio), salePrice?, stock }`.



## UI behavior



- Formulário: React Hook Form + Zod (`product-admin.schema.ts`), tema Stitch dos tokens existentes.

- **Categoria:** controle tipo input que abre modal; seleção única estilo toggle nas folhas.

- **Variantes:** grade com add/remove linhas; persistência via POST.

- Lista em `/admin/produtos`: ação **Ver na loja** abre `/produtos/[id]` em nova aba (mesmo layout público que o cliente veria com o estado atual do produto).

- **Camadas:** handler só valida + gate; lógica em `product-admin.service.ts`; Prisma só em `product-admin.repository.ts`.



## Dependencies



- Clerk, Prisma, feature `admin` (gate), categorias via API compartilhada.



## Out of scope (current slice)



- **PATCH** de produto (edição) e upload real de binários para storage/CDN — galeria aceita URL + pré-visualização local até existir pipeline.

- Filtros avançados na lista admin.

- Vitrine usando preço/stoque por variante (catálogo público segue nível produto até existir UX específica).



**Status:** Active (create + list + categorias + modal folha + variantes persistidas + SKU servidor + campos logísticos removidos do formulário)  

**Version:** 1.4

