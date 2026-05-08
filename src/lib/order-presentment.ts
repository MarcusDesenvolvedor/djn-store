import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const ORDER_STATUS_PT: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  FULFILLING: "Em separação",
  DELIVERED: "Entregue",
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
