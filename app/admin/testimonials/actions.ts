"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { isUuid } from "@/lib/admin/form";

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const PATH_PATTERN = /^photos\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
const MAX_BYTES = 3 * 1024 * 1024;

type Fields = { name: string; role: string; quote: string; sort_order: number };

/** Reads and checks the text fields. Returns null when something is invalid. */
function readFields(formData: FormData): Fields | null {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").replace(/\r\n/g, "\n").trim();
  const sortOrder = Number(formData.get("sort_order"));
  if (!name || name.length > 200 || role.length > 200 || quote.length > 8000) return null;
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 9999) return null;
  return { name, role, quote, sort_order: sortOrder };
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const fields = readFields(formData);
  if (!fields) return;
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({ ...fields, is_visible: true });
  if (error) return;
  refresh();
}

export async function updateTestimonial(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fields = readFields(formData);
  if (!isUuid(id) || !fields) return { error: "Check the name, role, text and order, then try again." };
  const isVisible = formData.get("is_visible") === "on";
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ ...fields, is_visible: isVisible, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "The testimonial could not be saved." };
  refresh();
  return {};
}

async function discardPhoto(supabase: Awaited<ReturnType<typeof createClient>>, mediaId: string | null) {
  if (!mediaId) return;
  const { data: media } = await supabase.from("media_assets").select("object_path").eq("id", mediaId).maybeSingle();
  await supabase.from("media_assets").delete().eq("id", mediaId);
  if (media?.object_path) await discardFiles(supabase, [media.object_path]);
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return;
  const supabase = await createClient();
  const { data: old } = await supabase.from("testimonials").select("image_id").eq("id", id).single();
  await supabase.from("testimonials").delete().eq("id", id);
  await discardPhoto(supabase, old?.image_id ?? null);
  refresh();
}

export async function registerTestimonialPhoto(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (!isUuid(id) || !PATH_PATTERN.test(path)) return { error: "The photo upload could not be verified." };

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

  const { data: old, error: oldError } = await supabase.from("testimonials").select("image_id").eq("id", id).single();
  if (oldError || !old) {
    await discardFiles(supabase, [path]);
    return { error: "Testimonial not found." };
  }

  const { data: media, error: mediaError } = await supabase
    .from("media_assets")
    .insert({
      bucket: "portfolio-files",
      object_path: path,
      kind: "image",
      mime_type: file.mimeType,
      size_bytes: file.size,
      alt_text: "Photo of the person who wrote this testimonial",
      is_public: true,
    })
    .select("id")
    .single();
  if (mediaError || !media) {
    await discardFiles(supabase, [path]);
    return { error: "The photo could not be saved." };
  }

  const { error: updateError } = await supabase
    .from("testimonials")
    .update({ image_id: media.id, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) {
    await supabase.from("media_assets").delete().eq("id", media.id);
    await discardFiles(supabase, [path]);
    return { error: "The photo could not be linked." };
  }

  await discardPhoto(supabase, old.image_id);
  refresh();
  return {};
}

export async function removeTestimonialPhoto(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return;
  const supabase = await createClient();
  const { data: old } = await supabase.from("testimonials").select("image_id").eq("id", id).single();
  if (!old?.image_id) return;
  const { error } = await supabase
    .from("testimonials")
    .update({ image_id: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error("The photo could not be removed.");
  await discardPhoto(supabase, old.image_id);
  refresh();
}
