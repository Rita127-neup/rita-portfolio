"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkRequired } from "@/lib/admin/form";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PHOTO_EXTENSIONS, PHOTO_MAX_BYTES, PHOTO_PATH_PATTERN } from "@/lib/storage";

type GalleryUpload = { path: string; altText: string };

export async function registerGalleryPhotos(uploads: GalleryUpload[]) {
  await requireAdmin();

  if (!Array.isArray(uploads) || uploads.length < 1 || uploads.length > 5) {
    return { error: "Choose between one and five photos per upload." };
  }

  const cleanUploads: GalleryUpload[] = [];
  for (const upload of uploads) {
    if (
      !upload ||
      typeof upload.path !== "string" ||
      !PHOTO_PATH_PATTERN.test(upload.path)
    ) {
      return { error: "An upload could not be verified. Please try again." };
    }
    const altText =
      typeof upload.altText === "string" ? upload.altText.trim() : "";
    const altError = checkRequired(altText, 200);
    if (altError) return { error: "Photo description: " + altError };
    cleanUploads.push({ path: upload.path, altText });
  }

  const supabase = await createClient();
  const verified: {
    path: string;
    altText: string;
    mimeType: string;
    size: number;
  }[] = [];

  for (const upload of cleanUploads) {
    const file = await verifyUpload(
      supabase,
      upload.path,
      Object.keys(PHOTO_EXTENSIONS),
      PHOTO_MAX_BYTES,
    );
    if (!file.ok) {
      if (file.discard) await discardFiles(supabase, [upload.path]);
      await discardFiles(supabase, verified.map((item) => item.path));
      return { error: file.error };
    }
    if (!upload.path.endsWith("." + PHOTO_EXTENSIONS[file.mimeType])) {
      await discardFiles(supabase, [
        upload.path,
        ...verified.map((item) => item.path),
      ]);
      return { error: "One of the selected files has an invalid type." };
    }
    verified.push({
      ...upload,
      mimeType: file.mimeType,
      size: file.size,
    });
  }

  const mediaIds: string[] = [];
  for (const photo of verified) {
    const { data: media, error } = await supabase
      .from("media_assets")
      .insert({
        bucket: "portfolio-files",
        object_path: photo.path,
        kind: "image",
        mime_type: photo.mimeType,
        size_bytes: photo.size,
        alt_text: photo.altText,
        is_public: true,
      })
      .select("id")
      .single();

    if (error || !media) {
      if (mediaIds.length) {
        await supabase.from("media_assets").delete().in("id", mediaIds);
      }
      await discardFiles(supabase, verified.map((item) => item.path));
      return { error: "The photos could not be saved. Please try again." };
    }
    mediaIds.push(media.id);
  }

  const { data: last } = await supabase
    .from("home_gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const firstOrder = (last?.sort_order ?? 0) + 1;
  const { error } = await supabase.from("home_gallery_images").insert(
    mediaIds.map((mediaId, index) => ({
      media_id: mediaId,
      sort_order: firstOrder + index,
    })),
  );

  if (error) {
    await supabase.from("media_assets").delete().in("id", mediaIds);
    await discardFiles(supabase, verified.map((item) => item.path));
    return {
      error: "The photos could not be added to the gallery. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?saved=1");
}

export async function removeGalleryPhoto(id: string) {
  await requireAdmin();
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    redirect("/admin/gallery?error=remove");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_gallery_images")
    .select("media:media_assets(id, object_path)")
    .eq("id", id)
    .maybeSingle();
  const media = Array.isArray(data?.media) ? data.media[0] : data?.media;
  if (error || !media) redirect("/admin/gallery?error=remove");

  const { error: deleteError } = await supabase
    .from("home_gallery_images")
    .delete()
    .eq("id", id);
  if (deleteError) redirect("/admin/gallery?error=remove");

  await supabase.from("media_assets").delete().eq("id", media.id);
  await discardFiles(supabase, [media.object_path]);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery?removed=1");
}
