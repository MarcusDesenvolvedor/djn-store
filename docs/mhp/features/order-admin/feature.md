# Feature: Admin — pedidos (leitura)

## Purpose

Listar pedidos da loja no painel (`/admin/pedidos`) e exibir detalhe com cliente, itens, valores e pagamento, alinhado ao modelo em `docs/mhp/data-model.md`.

## Flows

### Staff abre `/admin/pedidos`

1. Autenticado e com acesso admin (mesma regra que o shell em `docs/mhp/features/admin/feature.md`).
2. Lista pedidos: ID, status, cliente, quantidade de itens, total, data de criação.
3. Link para `/admin/pedidos/[orderId]` com detalhes.

### Detalhe `/admin/pedidos/[orderId]`

- Identificação do pedido, status.
- Cliente e endereço; e-mail da conta quando `userId` existe.
- Produtos: nome, quantidades, preços (snapshot) e link para visualização pública do produto (`/produtos/[id]`).
- Pagamento quando existir: status, `method` opcional (forma de pagamento), datas de registro e confirmação.

## Business rules

- Somente leitura; sem mutação nesta fatia.
- Dados sensíveis apenas para staff autentizado (layout admin).

## Entities

- `Order`, `OrderItem`, `Product`, `Payment` (`method` opcional), `User`.

## API

- Nenhum endpoint dedicado nesta fatia; páginas usam service → repository no servidor.

## UI

- Mesmos tokens Tailwind do painel (`admin-sidebar` inclui item Pedidos).

**Status:** Active  
**Version:** 1.0
