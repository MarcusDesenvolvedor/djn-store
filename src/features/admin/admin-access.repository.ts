import { prisma } from "@/lib/prisma";

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function adminAllowedEmailExists(normalizedEmail: string): Promise<boolean> {
  const row = await prisma.adminAllowedEmail.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  return row !== null;
}
