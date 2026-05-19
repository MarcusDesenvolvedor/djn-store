import type { OrderStatus, PaymentStatus } from "@prisma/client";

/** Admin/dashboard copy: agrupa `PAID` e `FULFILLING` em “Em Separação”; `DELIVERED` como “Enviado”. Ver `feature.md`. */
export const ORDER_STATUS_PT: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando Pagamento",
  PAID: "Em Separação",
  FULFILLING: "Em Separação",
  DELIVERED: "Enviado",
  CANCELED: "Cancelado",
};

export const PAYMENT_STATUS_PT: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
};

export function formatDateTimePt(value: Date): string {
  return value.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
