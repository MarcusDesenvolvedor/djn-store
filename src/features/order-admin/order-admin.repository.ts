import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";export type OrderAdminListRow = {
  id: string;
  status: OrderStatus;
  totalAmountStr: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  itemCount: number;
};

export type OrderAdminDetailRow = {
  id: string;
  status: OrderStatus;
  totalAmountStr: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  identificationNumber: string;
  phone: string;
  userEmail: string | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPriceStr: string;
    lineTotalStr: string;
    productId: number;
    productName: string;
  }>;
  payment:
    | {
        id: string;
        status: "PENDING" | "CONFIRMED";
        method: string | null;
        createdAt: Date;
        confirmedAt: Date | null;
      }
    | null;
};

export async function findOrdersForAdminList(take = 200): Promise<OrderAdminListRow[]> {
  const rows = await prisma.order.findMany({
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      _count: { select: { items: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    totalAmountStr: row.totalAmount.toString(),
    createdAt: row.createdAt,
    firstName: row.firstName,
    lastName: row.lastName,
    itemCount: row._count.items,
  }));
}

export async function findOrderAdminDetailById(orderId: string): Promise<OrderAdminDetailRow | null> {
  const row = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      street: true,
      number: true,
      city: true,
      state: true,
      country: true,
      identificationNumber: true,
      phone: true,
      user: { select: { email: true } },
      items: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          quantity: true,
          price: true,
          productId: true,
          product: { select: { name: true } },
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
          method: true,
          createdAt: true,
          confirmedAt: true,
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    status: row.status,
    totalAmountStr: row.totalAmount.toString(),
    createdAt: row.createdAt,
    firstName: row.firstName,
    lastName: row.lastName,
    street: row.street,
    number: row.number,
    city: row.city,
    state: row.state,
    country: row.country,
    identificationNumber: row.identificationNumber,
    phone: row.phone,
    userEmail: row.user?.email ?? null,
    items: row.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPriceStr: item.price.toString(),
      lineTotalStr: item.price.mul(item.quantity).toString(),
      productId: item.productId,
      productName: item.product.name,
    })),
    payment: row.payment
      ? {
          id: row.payment.id,
          status: row.payment.status,
          method: row.payment.method,
          createdAt: row.payment.createdAt,
          confirmedAt: row.payment.confirmedAt,
        }
      : null,
  };
}
