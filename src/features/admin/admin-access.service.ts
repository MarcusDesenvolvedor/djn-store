import { auth, currentUser } from "@clerk/nextjs/server";
import { adminAllowedEmailExists, normalizeAdminEmail } from "./admin-access.repository";

export type AdminApiGateResult = { ok: true } | { ok: false; status: 401 | 403 };

export async function requireAdminApiSession(): Promise<AdminApiGateResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, status: 401 };
  }
  const user = await currentUser();
  const allowed = await canUserAccessAdminPanel(user?.primaryEmailAddress?.emailAddress);
  if (!allowed) {
    return { ok: false, status: 403 };
  }
  return { ok: true };
}

function isAdminAccessAllowAll(): boolean {
  return process.env.ADMIN_ACCESS_ALLOW_ALL === "true";
}

/**
 * When `ADMIN_ACCESS_ALLOW_ALL=true`, any authenticated session may open `/admin`
 * (temporary debugging — revert before production).
 */
export async function canUserAccessAdminPanel(primaryEmail: string | undefined): Promise<boolean> {
  if (isAdminAccessAllowAll()) {
    return true;
  }
  if (!primaryEmail) {
    return false;
  }
  return adminAllowedEmailExists(normalizeAdminEmail(primaryEmail));
}
