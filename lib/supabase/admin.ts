// Server-side admin authorization. Checks the signed-in user against the
// admin list via public.is_admin(), which returns only a boolean for the
// caller. This is a convenience gate for admin routes; RLS policies remain
// the real protection for data.

import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "./server";

export type AdminUser = {
  id: string;
  email: string | null;
};

export type AuthState =
  | { status: "signed-out" }
  | { status: "not-admin"; user: AdminUser }
  | { status: "admin"; user: AdminUser };

/**
 * Resolves the current visitor's auth state. Fails closed: any error while
 * checking admin status is treated as "not-admin". Cached per request.
 */
export const getAuthState = cache(async (): Promise<AuthState> => {
  const supabase = await createClient();

  // getClaims() validates the JWT; never trust getSession() on the server.
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (claimsError || !claims?.sub) return { status: "signed-out" };

  const user: AdminUser = {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return { status: "not-admin", user };

  return { status: "admin", user };
});

/**
 * Returns the signed-in admin, or null if there is no valid session or the
 * user is not an admin.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const state = await getAuthState();
  return state.status === "admin" ? state.user : null;
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminUser()) !== null;
}

/**
 * Call at the top of every protected admin page and Server Function.
 * Redirects signed-out visitors to the login page and signed-in non-admins
 * to the access-denied page; otherwise returns the admin user.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const state = await getAuthState();
  if (state.status === "signed-out") redirect("/admin/login");
  if (state.status === "not-admin") redirect("/admin/denied");
  return state.user;
}
