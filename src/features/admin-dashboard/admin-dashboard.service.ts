import {
  findAdminDashboardStats,
  findDailyConfirmedRevenueLast30DaysBrt,
  findRecentOrdersForDashboard,
  type AdminDashboardDailyRevenueRow,
  type AdminDashboardRecentOrderRow,
  type AdminDashboardStatsRow,
} from "./admin-dashboard.repository";

export type {
  AdminDashboardDailyRevenueRow,
  AdminDashboardRecentOrderRow,
  AdminDashboardStatsRow,
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStatsRow> {
  return findAdminDashboardStats();
}

export async function getAdminRecentOrdersForDashboard(
  take: number,
): Promise<AdminDashboardRecentOrderRow[]> {
  return findRecentOrdersForDashboard(take);
}

export async function getAdminDashboardPageData(): Promise<{
  stats: AdminDashboardStatsRow;
  recentOrders: AdminDashboardRecentOrderRow[];
  revenueLast30Days: AdminDashboardDailyRevenueRow[];
}> {
  const [stats, recentOrders, revenueLast30Days] = await Promise.all([
    findAdminDashboardStats(),
    findRecentOrdersForDashboard(8),
    findDailyConfirmedRevenueLast30DaysBrt(),
  ]);
  return { stats, recentOrders, revenueLast30Days };
}
