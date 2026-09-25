// Server-side checks for files the admin uploaded straight to Storage from
// the browser. The browser upload is already limited by Storage RLS (admins
// only) and the bucket's size/type limits; this re-checks the stored object
// before it is linked to the site.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { STORAGE_BUCKET } from "@/lib/storage";

type Verified =
  | { ok: true; mimeType: string; size: number }
  | { ok: false; error: string; discard: boolean };

/**
 * Confirms that `path` is a new upload (not already used by the site) with
 * an allowed type and size. `discard` says whether the caller may delete the
 * object after a failure: never for a path the site already uses.
 */
export async function verifyUpload(
  supabase: SupabaseClient,
  path: string,
  allowedTypes: string[],
  maxBytes: number,
): Promise<Verified> {
  const { data: existing, error: existingError } = await supabase
    .from("media_assets")
    .select("id")
    .eq("bucket", STORAGE_BUCKET)
    .eq("object_path", path)
    .limit(1);
  if (existingError)
    return { ok: false, error: "The upload could not be checked.", discard: false };
  if (existing.length > 0)
    return { ok: false, error: "This file is already in use.", discard: false };

  const { data: info, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .info(path);
  if (error || !info)
    return { ok: false, error: "The uploaded file could not be found.", discard: false };

  const mimeType = info.contentType ?? "";
  const size = info.size ?? 0;
  if (!allowedTypes.includes(mimeType))
    return { ok: false, error: "This file type is not allowed.", discard: true };
  if (size <= 0 || size > maxBytes)
    return { ok: false, error: "This file is too large.", discard: true };

  return { ok: true, mimeType, size };
}

/** Best-effort delete of objects that are no longer used by the site. */
export async function discardFiles(
  supabase: SupabaseClient,
  paths: string[] | null | undefined,
): Promise<void> {
  if (!paths || paths.length === 0) return;
  await supabase.storage.from(STORAGE_BUCKET).remove(paths);
}
