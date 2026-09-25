"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const PATH_PATTERN = /^logos\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
const MAX_BYTES = 2 * 1024 * 1024;

export async function createOrganization(formData: FormData): Promise<void> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order"));
  if (!name || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999) return;
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").insert({ name, sort_order: sortOrder, is_visible: true });
  if (error) return;
  revalidatePath("/");
  revalidatePath("/admin/organizations");
}

export async function deleteOrganization(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const { data: old } = await supabase.from("organizations").select("image_id").eq("id", id).single();
  if (old?.image_id) {
    const { data: media } = await supabase.from("media_assets").select("object_path").eq("id", old.image_id).maybeSingle();
    await supabase.from("media_assets").delete().eq("id", old.image_id);
    if (media?.object_path) await discardFiles(supabase, [media.object_path]);
  }
  await supabase.from("organizations").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/organizations");
}

export async function updateOrganization(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order"));
  const isVisible = formData.get("is_visible") === "on";
  if (!id || !name || !Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999)
    return { error: "Please enter a valid name and display order." };
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update({ name, sort_order: sortOrder, is_visible: isVisible, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: "The organization could not be saved." };
  revalidatePath("/");
  revalidatePath("/admin/organizations");
  return {};
}

export async function registerOrganizationLogo(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (!id || !PATH_PATTERN.test(path)) return { error: "The logo upload could not be verified." };

  const supabase = await createClient();
  const file = await verifyUpload(supabase, path, Object.keys(EXTENSIONS), MAX_BYTES);
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }
  if (!path.endsWith(`.${EXTENSIONS[file.mimeType]}`)) {
    await discardFiles(supabase, [path]);
    return { error: "This file type is not allowed." };
  }

  const { data: old, error: oldError } = await supabase.from("organizations").select("image_id").eq("id", id).single();
  if (oldError || !old) {
    await discardFiles(supabase, [path]);
    return { error: "Organization not found." };
  }

  const { data: media, error: mediaError } = await supabase.from("media_assets").insert({
    bucket: "portfolio-files", object_path: path, kind: "image", mime_type: file.mimeType,
    size_bytes: file.size, alt_text: "Organization logo", is_public: true,
  }).select("id").single();
  if (mediaError || !media) {
    await discardFiles(supabase, [path]);
    return { error: "The logo could not be saved." };
  }

  const { error: updateError } = await supabase.from("organizations").update({ image_id: media.id, updated_at: new Date().toISOString() }).eq("id", id);
  if (updateError) {
    await supabase.from("media_assets").delete().eq("id", media.id);
    await discardFiles(supabase, [path]);
    return { error: "The logo could not be linked." };
  }

  if (old.image_id) {
    const { data: oldMedia } = await supabase.from("media_assets").select("object_path").eq("id", old.image_id).maybeSingle();
    await supabase.from("media_assets").delete().eq("id", old.image_id);
    if (oldMedia?.object_path) await discardFiles(supabase, [oldMedia.object_path]);
  }

  revalidatePath("/");
  revalidatePath("/admin/organizations");
  redirect("/admin/organizations?saved=1");
}

export async function removeOrganizationLogo(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { data: old } = await supabase.from("organizations").select("image_id").eq("id", id).single();
  if (!old?.image_id) return;
  const { data: oldMedia } = await supabase.from("media_assets").select("object_path").eq("id", old.image_id).maybeSingle();
  const { error } = await supabase.from("organizations").update({ image_id: null, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error("The logo could not be removed.");
  await supabase.from("media_assets").delete().eq("id", old.image_id);
  if (oldMedia?.object_path) await discardFiles(supabase, [oldMedia.object_path]);
  revalidatePath("/");
  revalidatePath("/admin/organizations");
}
