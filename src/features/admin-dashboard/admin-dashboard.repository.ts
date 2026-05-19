import type { OrderStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listLastBrazilYmdOldestFirst, formatBrazilDateYmd, brazilDayRangeUtc } from "@/lib/brazil-clock";
import { ADMIN_LOW_STOCK_THRESHOLD } from "./admin-dashboard.constants";

export type AdminDashboardStatsRow = {
  /** Soma confirmada (`Payment.CONFIRMED`) no dia corrente (BRT). */
  salesTodayBrl: string;
  /** Pedidos em `OrderStatus.PENDING_PAYMENT`. */
  pendingOrdersCount: number;
  /** Média de `Order.totalAmount` em pedidos com pagamento confirmado nos últimos 30 dias corridos BRT. */
  averageTicketLast30DaysBrl: string;
  /** Produtos ativos com `stock === 0`. */
  outOfStockActiveCount: number;
  /** Compatível com `/admin/configuracoes` — resumo. */
  ordersLast24h: number;
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

export type AdminDashboardDailyRevenueRow = {
  /** YYYY-MM-DD (BRT) */
  dayYmd: string;
  /** Soma Decimal serializada para exibição. */
  revenueBrl: string;
};

function rolling24hSinceUtc(): Date {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

/** Início BRT do primeiro dia da série e exclusivo do primeiro instante depois do último dia. */
function brt30DayQueryWindowUtc(): { startInclusive: Date; endExclusive: Date } {
  const oldestFirst = listLastBrazilYmdOldestFirst(new Date(), 30);
  const oldestYmd = oldestFirst[0];
  const newestYmd = oldestFirst[29];
  if (!oldestYmd || !newestYmd) {
    throw new Error("brt30DayQueryWindowUtc: expected thirty BRT calendar dates.");
  }
  const { startUtc } = brazilDayRangeUtc(oldestYmd);
  const { endUtcExclusive } = brazilDayRangeUtc(newestYmd);
  return { startInclusive: startUtc, endExclusive: endUtcExclusive };
}

export async function findAdminDashboardStats(): Promise<AdminDashboardStatsRow> {
  const since24hUtc = rolling24hSinceUtc();
  const oldestFirst30 = listLastBrazilYmdOldestFirst(new Date(), 30);
  const newestYmd = oldestFirst30[29];
  if (!newestYmd) {
    throw new Error("findAdminDashboardStats: expected BRT date range.");
  }

  const { startUtc: todayStartUtc, endUtcExclusive: todayEndUtcExclusive } = brazilDayRangeUtc(newestYmd);

  const { startInclusive: window30StartInclusive, endExclusive: window30EndExclusive } =
    brt30DayQueryWindowUtc();

  const thirtyDaysPaidWhere = {
    payment: {
      is: {
        status: "CONFIRMED" as const,
        confirmedAt: {
          gte: window30StartInclusive,
          lt: window30EndExclusive,
        },
      },
    },
  } satisfies Prisma.OrderWhereInput;

  const [
    ordersLast24h,
    pendingOrdersCount,
    activeProducts,
    totalProducts,
    lowStockActiveCount,
    categoriesCount,
    totalOrdersAllTime,
    outOfStockActiveCount,
    salesTodayAgg,
    paid30SumAgg,
    paid30Count,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since24hUtc } } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count(),
    prisma.product.count({
      where: { isActive: true, stock: { lt: ADMIN_LOW_STOCK_THRESHOLD } },
    }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.product.count({ where: { isActive: true, stock: { equals: 0 } } }),
    prisma.order.aggregate({
      where: {
        payment: {
          is: {
            status: "CONFIRMED",
            confirmedAt: {
              gte: todayStartUtc,
              lt: todayEndUtcExclusive,
            },
          },
        },
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.aggregate({
      where: thirtyDaysPaidWhere,
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: thirtyDaysPaidWhere,
    }),
  ]);

  const salesTodaySum = salesTodayAgg._sum.totalAmount;
  const salesTodayBrl =
    salesTodaySum !== undefined && salesTodaySum !== null ? salesTodaySum.toString() : "0";

  const paid30SumDecimal = paid30SumAgg._sum.totalAmount ?? new Prisma.Decimal(0);
  const avgTicketDecimal =
    paid30Count > 0 ? paid30SumDecimal.div(new Prisma.Decimal(paid30Count)) : new Prisma.Decimal(0);
  const averageTicketLast30DaysBrl = avgTicketDecimal.toString();

  return {
    salesTodayBrl,
    pendingOrdersCount,
    averageTicketLast30DaysBrl,
    outOfStockActiveCount,
    ordersLast24h,
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

/** Faturamento diário BRT (somente pagamentos CONFIRMED) nos últimos 30 dias corridos; dias sem dados = 0. */
export async function findDailyConfirmedRevenueLast30DaysBrt(): Promise<AdminDashboardDailyRevenueRow[]> {
  const dayKeys = listLastBrazilYmdOldestFirst(new Date(), 30);
  const totals = new Map<string, Prisma.Decimal>();
  dayKeys.forEach((k) => {
    totals.set(k, new Prisma.Decimal(0));
  });

  const { startInclusive, endExclusive } = brt30DayQueryWindowUtc();

  const rows = await prisma.order.findMany({
    where: {
      payment: {
        is: {
          status: "CONFIRMED",
          confirmedAt: {
            gte: startInclusive,
            lt: endExclusive,
          },
        },
      },
    },
    select: {
      totalAmount: true,
      payment: {
        select: {
          confirmedAt: true,
        },
      },
    },
  });

  for (const row of rows) {
    const confirmedAt = row.payment?.confirmedAt;
    if (!confirmedAt) continue;

    const ymd = formatBrazilDateYmd(confirmedAt);
    const bucket = totals.get(ymd);
    if (bucket !== undefined) {
      totals.set(ymd, bucket.add(row.totalAmount));
    }
  }

  return dayKeys.map((dayYmd) => ({
    dayYmd,
    revenueBrl: (totals.get(dayYmd) ?? new Prisma.Decimal(0)).toString(),
  }));
}
