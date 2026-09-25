// Redirects for files in the private Storage bucket. The bucket is never
// public: each request signs a short-lived URL with the publishable key, and
// Storage RLS only allows signing files that the current CV / home photo
// points to.

import "server-only";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { SIGNED_URL_SECONDS, STORAGE_BUCKET } from "@/lib/storage";

export async function redirectToSignedFile(
  objectPath: string | null,
  options: { download?: string; cacheSeconds: number },
): Promise<Response> {
  if (!objectPath) return new Response("Not found", { status: 404 });

  const { data, error } = await getPublicSupabaseClient()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_SECONDS, {
      download: options.download,
    });

  if (error || !data) return new Response("Not found", { status: 404 });

  return new Response(null, {
    status: 302,
    headers: {
      Location: data.signedUrl,
      // The signed URL outlives this cache time, so a cached redirect never
      // points at an expired link. "private" keeps it out of shared caches.
      "Cache-Control":
        options.cacheSeconds > 0
          ? `private, max-age=${options.cacheSeconds}`
          : "private, no-store",
    },
  });
}
