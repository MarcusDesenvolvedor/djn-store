import { adminAllowedEmailExists, normalizeAdminEmail } from "./admin-access.repository";

export async function canUserAccessAdminPanel(primaryEmail: string | undefined): Promise<boolean> {
  if (!primaryEmail) {
    return false;
  }
  return adminAllowedEmailExists(normalizeAdminEmail(primaryEmail));
}
