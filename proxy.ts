import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only routes that use the signed-in session go through the proxy. Public
// pages read content with the cookie-free public client and are unaffected.
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
