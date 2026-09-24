// Supabase client for Client Components. The session is stored in cookies so
// the server and proxy can read the same signed-in user.

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}
