import { adminOrderIdParamSchema } from "./order-admin.schema";
import { findOrderAdminDetailById, findOrdersForAdminList, type OrderAdminDetailRow, type OrderAdminListRow } from "./order-admin.repository";

export type { OrderAdminDetailRow, OrderAdminListRow };

export async function listOrdersForAdmin(take?: number): Promise<OrderAdminListRow[]> {
  return findOrdersForAdminList(take);
}

export async function getOrderAdminDetailById(orderIdRaw: unknown): Promise<OrderAdminDetailRow | null> {
  const parsed = adminOrderIdParamSchema.safeParse(orderIdRaw);
  if (!parsed.success) {
    return null;
  }
  return findOrderAdminDetailById(parsed.data);
}
