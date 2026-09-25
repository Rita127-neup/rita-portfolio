// Home page photo: redirects to a short-lived signed URL for the current
// photo in the private Storage bucket.

import { getHeroPhotoPath } from "@/lib/content";
import { redirectToSignedFile } from "@/lib/content/files";

export const dynamic = "force-dynamic";

export async function GET() {
  return redirectToSignedFile(await getHeroPhotoPath(), { cacheSeconds: 120 });
}
