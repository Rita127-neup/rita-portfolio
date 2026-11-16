import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { redirectToSignedFile } from "@/lib/content/files";

export const dynamic = "force-dynamic";

/** The voice recording of how the name is said, if one has been uploaded. */
export async function GET() {
  const { data } = await getPublicSupabaseClient()
    .from("site_settings")
    .select("audio:media_assets(object_path)")
    .eq("id", 1)
    .maybeSingle<{ audio: { object_path: string } | null }>();
  return redirectToSignedFile(data?.audio?.object_path ?? null, { cacheSeconds: 120 });
}
