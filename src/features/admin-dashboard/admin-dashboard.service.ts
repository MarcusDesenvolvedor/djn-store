import {
  findAdminDashboardStats,
  findRecentOrdersForDashboard,
  type AdminDashboardRecentOrderRow,
  type AdminDashboardStatsRow,
} from "./admin-dashboard.repository";

export type { AdminDashboardRecentOrderRow, AdminDashboardStatsRow };

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
}> {
  const [stats, recentOrders] = await Promise.all([
    findAdminDashboardStats(),
    findRecentOrdersForDashboard(8),
  ]);
  return { stats, recentOrders };
}
