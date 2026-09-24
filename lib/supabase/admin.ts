// Server-side admin authorization. Checks the signed-in user against the
// admin list via public.is_admin(), which returns only a boolean for the
// caller. This is a convenience gate for admin routes; RLS policies remain
// the real protection for data.

import "server-only";
import { cache } from "react";
import { createClient } from "./server";

export type AdminUser = {
  id: string;
  email: string | null;
};

/**
 * Returns the signed-in admin, or null if there is no valid session or the
 * user is not an admin. Fails closed: any error is treated as "not admin".
 * Cached per request.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();

  // getClaims() validates the JWT; never trust getSession() on the server.
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (claimsError || !claims?.sub) return null;

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
});

export async function isAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}
