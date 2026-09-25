"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRequired } from "@/lib/admin/form";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  PHOTO_EXTENSIONS,
  PHOTO_MAX_BYTES,
  PHOTO_PATH_PATTERN,
} from "@/lib/storage";

export type UploadResult = { error: string };

function revalidatePhoto() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/photo");
}

/**
 * Links an image the admin just uploaded to Storage as the home page photo,
 * then deletes the previous photo file.
 */
export async function registerPhoto(
  path: string,
  altText: string,
): Promise<UploadResult> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  if (typeof path !== "string" || !PHOTO_PATH_PATTERN.test(path))
    return { error: "The upload could not be verified. Please try again." };
  const cleanAlt = typeof altText === "string" ? altText.trim() : "";
  const altError = checkRequired(cleanAlt, 200);
  if (altError) return { error: `Description: ${altError}` };

  // Runs as the signed-in admin; Storage and table RLS limit what can change.
  const supabase = await createClient();
  const file = await verifyUpload(
    supabase,
    path,
    Object.keys(PHOTO_EXTENSIONS),
    PHOTO_MAX_BYTES,
  );
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }
  // The stored type must match the file extension in the path.
  if (!path.endsWith(`.${PHOTO_EXTENSIONS[file.mimeType]}`)) {
    await discardFiles(supabase, [path]);
    return { error: "This file type is not allowed." };
  }

  const { data: oldPaths, error } = await supabase.rpc("replace_hero_photo", {
    p_object_path: path,
    p_mime_type: file.mimeType,
    p_size_bytes: file.size,
    p_alt_text: cleanAlt,
  });

  if (error) {
    await discardFiles(supabase, [path]);
    return { error: "The photo could not be saved. Please try again." };
  }

  await discardFiles(
    supabase,
    (oldPaths as string[] | null)?.filter((old) => old !== path),
  );

  revalidatePhoto();
  redirect("/admin/photo?saved=1");
}

export async function removePhoto(): Promise<void> {
  await requireAdmin();

  const supabase = await createClient();
  const { data: oldPaths, error } = await supabase.rpc("remove_hero_photo");
  if (error) redirect("/admin/photo?error=remove");

  await discardFiles(supabase, oldPaths as string[] | null);

  revalidatePhoto();
  redirect("/admin/photo?removed=1");
}
