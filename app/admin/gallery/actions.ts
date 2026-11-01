"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRequired } from "@/lib/admin/form";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PHOTO_EXTENSIONS, PHOTO_MAX_BYTES, PHOTO_PATH_PATTERN } from "@/lib/storage";

export async function registerGalleryPhoto(path: string, altText: string) {
  await requireAdmin();
  if (typeof path !== "string" || !PHOTO_PATH_PATTERN.test(path))
    return { error: "The upload could not be verified." };
  const alt = typeof altText === "string" ? altText.trim() : "";
  const altError = checkRequired(alt, 200);
  if (altError) return { error: altError };

  const supabase = await createClient();
  const file = await verifyUpload(supabase, path, Object.keys(PHOTO_EXTENSIONS), PHOTO_MAX_BYTES);
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }
  if (!path.endsWith(`.${PHOTO_EXTENSIONS[file.mimeType]}`)) {
    await discardFiles(supabase, [path]);
    return { error: "This file type is not allowed." };
  }

  const { data: media, error: mediaError } = await supabase
    .from("media_assets")
    .insert({
      bucket: "portfolio-files",
      object_path: path,
      kind: "image",
      mime_type: file.mimeType,
      size_bytes: file.size,
      alt_text: alt,
      is_public: true,
    })
    .select("id")
    .single();
  if (mediaError || !media) {
    await discardFiles(supabase, [path]);
    return { error: "The photo could not be saved." };
  }

  const { data: last } = await supabase
    .from("home_gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from("home_gallery_images").insert({
    media_id: media.id,
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  if (error) {
    await supabase.from("media_assets").delete().eq("id", media.id);
    await discardFiles(supabase, [path]);
    return { error: "The photo could not be added to the gallery." };
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?saved=1");
}

export async function removeGalleryPhoto(id: string) {
  await requireAdmin();
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/gallery?error=remove");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_gallery_images")
    .select("media:media_assets(id, object_path)")
    .eq("id", id)
    .maybeSingle();
  const media = Array.isArray(data?.media) ? data.media[0] : data?.media;
  if (error || !media) redirect("/admin/gallery?error=remove");
  const { error: deleteError } = await supabase.from("home_gallery_images").delete().eq("id", id);
  if (deleteError) redirect("/admin/gallery?error=remove");
  await supabase.from("media_assets").delete().eq("id", media.id);
  await discardFiles(supabase, [media.object_path]);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?removed=1");
}
