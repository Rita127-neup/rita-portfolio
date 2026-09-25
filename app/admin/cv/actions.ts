"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRequired } from "@/lib/admin/form";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CV_MAX_BYTES, CV_PATH_PATTERN } from "@/lib/storage";

export type UploadResult = { error: string };

function revalidateCv() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/cv");
}

/**
 * Links a PDF the admin just uploaded to Storage as the current CV, then
 * deletes the previous CV file.
 */
export async function registerCv(
  path: string,
  title: string,
): Promise<UploadResult> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  if (typeof path !== "string" || !CV_PATH_PATTERN.test(path))
    return { error: "The upload could not be verified. Please try again." };
  const cleanTitle = typeof title === "string" ? title.trim() : "";
  const titleError = checkRequired(cleanTitle, 100);
  if (titleError) return { error: `Title: ${titleError}` };

  // Runs as the signed-in admin; Storage and table RLS limit what can change.
  const supabase = await createClient();
  const file = await verifyUpload(
    supabase,
    path,
    ["application/pdf"],
    CV_MAX_BYTES,
  );
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }

  const { data: oldPaths, error } = await supabase.rpc("replace_current_cv", {
    p_object_path: path,
    p_mime_type: file.mimeType,
    p_size_bytes: file.size,
    p_title: cleanTitle,
  });

  if (error) {
    await discardFiles(supabase, [path]);
    return { error: "The CV could not be saved. Please try again." };
  }

  await discardFiles(
    supabase,
    (oldPaths as string[] | null)?.filter((old) => old !== path),
  );

  revalidateCv();
  redirect("/admin/cv?saved=1");
}

export async function removeCv(): Promise<void> {
  await requireAdmin();

  const supabase = await createClient();
  const { data: oldPaths, error } = await supabase.rpc("remove_current_cv");
  if (error) redirect("/admin/cv?error=remove");

  await discardFiles(supabase, oldPaths as string[] | null);

  revalidateCv();
  redirect("/admin/cv?removed=1");
}
