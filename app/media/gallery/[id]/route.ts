import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { redirectToSignedFile } from "@/lib/content/files";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const { data } = await getPublicSupabaseClient()
    .from("home_gallery_images")
    .select("media:media_assets(object_path)")
    .eq("id", id)
    .maybeSingle();
  const media = Array.isArray(data?.media) ? data.media[0] : data?.media;
  return redirectToSignedFile(media?.object_path ?? null, { cacheSeconds: 120 });
}
