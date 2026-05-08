import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ADMIN_LOW_STOCK_THRESHOLD } from "./admin-dashboard.constants";

export type AdminDashboardStatsRow = {
  ordersLast24h: number;
  revenueLast24h: string;
  activeProducts: number;
  totalProducts: number;
  lowStockActiveCount: number;
  categoriesCount: number;
  totalOrdersAllTime: number;
};

export type AdminDashboardRecentOrderRow = {
  id: string;
  status: OrderStatus;
  totalAmountStr: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
};

function rolling24hSince(): Date {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export async function findAdminDashboardStats(): Promise<AdminDashboardStatsRow> {
  const since = rolling24hSince();

  const [
    ordersLast24h,
    revenueAgg,
    activeProducts,
    totalProducts,
    lowStockActiveCount,
    categoriesCount,
    totalOrdersAllTime,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.order.aggregate({
      where: {
        payment: {
          is: {
            status: "CONFIRMED",
            confirmedAt: { gte: since },
          },
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count(),
    prisma.product.count({
      where: { isActive: true, stock: { lt: ADMIN_LOW_STOCK_THRESHOLD } },
    }),
    prisma.category.count(),
    prisma.order.count(),
  ]);

  const revenueSum = revenueAgg._sum.totalAmount;
  const revenueLast24h =
    revenueSum !== null && revenueSum !== undefined ? revenueSum.toString() : "0";

  return {
    ordersLast24h,
    revenueLast24h,
    activeProducts,
    totalProducts,
    lowStockActiveCount,
    categoriesCount,
    totalOrdersAllTime,
  };
}

export async function findRecentOrdersForDashboard(take: number): Promise<AdminDashboardRecentOrderRow[]> {
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
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    totalAmountStr: row.totalAmount.toString(),
    createdAt: row.createdAt,
    firstName: row.firstName,
    lastName: row.lastName,
  }));
}
