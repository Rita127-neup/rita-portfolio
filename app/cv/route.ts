// Public CV download: redirects to a short-lived signed URL for the current
// published CV in the private Storage bucket.

import { getCurrentCv } from "@/lib/content";
import { redirectToSignedFile } from "@/lib/content/files";

export const dynamic = "force-dynamic";

export async function GET() {
  const cv = await getCurrentCv();
  const fileName = cv
    ? `${cv.title.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "CV"}.pdf`
    : undefined;

  return redirectToSignedFile(cv?.objectPath ?? null, {
    download: fileName,
    cacheSeconds: 0,
  });
}
