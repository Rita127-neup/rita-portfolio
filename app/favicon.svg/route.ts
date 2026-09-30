import { getHeroPhotoPath } from "@/lib/content";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { STORAGE_BUCKET } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const path = await getHeroPhotoPath();
  if (!path) return new Response("Not found", { status: 404 });

  const { data, error } = await getPublicSupabaseClient()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(path, 300);

  if (error || !data?.signedUrl) return new Response("Not found", { status: 404 });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><clipPath id="c"><circle cx="50" cy="50" r="46"/></clipPath></defs>
<circle cx="50" cy="50" r="50" fill="#07111f"/>
<image href="${data.signedUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" x="-15" y="-15" width="130" height="130" preserveAspectRatio="xMidYMid slice" clip-path="url(#c)"/>
<circle cx="50" cy="50" r="46" fill="none" stroke="#d0a14a" stroke-width="4"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "private, max-age=300",
    },
  });
}
