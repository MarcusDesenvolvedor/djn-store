import { adminAllowedEmailExists, normalizeAdminEmail } from "./admin-access.repository";

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
