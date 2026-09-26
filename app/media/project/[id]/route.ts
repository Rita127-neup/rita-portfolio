import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { redirectToSignedFile } from "@/lib/content/files";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getPublicSupabaseClient()
    .from("projects")
    .select("image:media_assets(object_path)")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle<{ image: { object_path: string } | null }>();

  return redirectToSignedFile(data?.image?.object_path ?? null, { cacheSeconds: 120 });
}
