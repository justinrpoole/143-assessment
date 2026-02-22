import { getRequestAuthContext } from "@/lib/auth/request-context";

/**
 * Check if the current request is from an admin user.
 * Admin user IDs are defined in the ADMIN_USER_IDS env var (comma-separated UUIDs).
 */
export async function isAdminRequest(): Promise<boolean> {
  const adminIds = process.env.ADMIN_USER_IDS;
  if (!adminIds) return false;

  const ctx = await getRequestAuthContext();
  if (!ctx.isAuthenticated || !ctx.userId) return false;

  const allowedIds = new Set(
    adminIds.split(",").map((id) => id.trim().toLowerCase()),
  );

  return allowedIds.has(ctx.userId.toLowerCase());
}
