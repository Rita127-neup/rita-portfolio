// Shared settings for the private Supabase Storage bucket that holds the CV
// and the home page photo. Must match the bucket and folder rules in
// supabase/migrations/20260925120000_cv_and_photo_storage.sql.

export const STORAGE_BUCKET = "portfolio-files";

export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

export const CV_PATH_PATTERN = new RegExp(`^cv/${UUID}\\.pdf$`);
export const PHOTO_PATH_PATTERN = new RegExp(`^photos/${UUID}\\.(jpg|png|webp)$`);

/** Signed URLs for public visitors are short-lived; the site re-signs per request. */
export const SIGNED_URL_SECONDS = 60 * 5;
