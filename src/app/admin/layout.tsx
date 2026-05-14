import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { canUserAccessAdminPanel } from "@/features/admin/admin-access.service";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const openAdminAccess = process.env.ADMIN_ACCESS_ALLOW_ALL === "true";
  const allowed = await canUserAccessAdminPanel(email);
  if (!allowed) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar sessionEmail={email ?? null} openAdminAccess={openAdminAccess} />
        <main className="px-margin-page py-8">{children}</main>
      </div>
    </div>
  );
}
