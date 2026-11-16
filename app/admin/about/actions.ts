"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";

const AUDIO_EXTENSIONS: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};
const AUDIO_PATH = /^audio\/[0-9a-f-]{36}\.(mp3|m4a|aac|wav|ogg|webm)$/;
const AUDIO_MAX_BYTES = 5 * 1024 * 1024;

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/about");
}

/** Saves the bio, languages, hobbies and the spelled-out pronunciation. */
export async function saveAbout(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const clean = (name: string, max: number) =>
    String(formData.get(name) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max + 1);
  const paragraphs = clean("about_paragraphs", 6000);
  const languages = clean("languages", 1500);
  const hobbies = clean("hobbies", 3000);
  const pronunciation = clean("pronunciation", 80);
  if (paragraphs.length > 6000 || languages.length > 1500 || hobbies.length > 3000 || pronunciation.length > 80)
    return { error: "One of the boxes is too long. Shorten it and try again." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ about_paragraphs: paragraphs, languages, hobbies, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: "Could not save. Please try again." };

  const { data: section } = await supabase
    .from("page_sections")
    .select("id, page:pages!inner(slug)")
    .eq("section_key", "name_pronunciation")
    .eq("page.slug", "home")
    .maybeSingle();
  if (section) {
    const { error: pronunciationError } = await supabase
      .from("page_sections")
      .update({ body: pronunciation })
      .eq("id", section.id);
    if (pronunciationError) return { error: "The text saved, but the pronunciation could not." };
  }

  refresh();
  return {};
}

async function currentAudio(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("site_settings").select("pronunciation_audio_id").eq("id", 1).single();
  return data?.pronunciation_audio_id ?? null;
}

async function discardAudio(supabase: Awaited<ReturnType<typeof createClient>>, mediaId: string | null) {
  if (!mediaId) return;
  const { data: media } = await supabase.from("media_assets").select("object_path").eq("id", mediaId).maybeSingle();
  await supabase.from("media_assets").delete().eq("id", mediaId);
  if (media?.object_path) await discardFiles(supabase, [media.object_path]);
}

/** Links a recording the browser just uploaded to Storage as the voice note. */
export async function registerPronunciationAudio(path: string): Promise<{ error?: string }> {
  await requireAdmin();
  if (typeof path !== "string" || !AUDIO_PATH.test(path)) return { error: "The upload could not be verified." };

  const supabase = await createClient();
  const file = await verifyUpload(supabase, path, Object.keys(AUDIO_EXTENSIONS), AUDIO_MAX_BYTES);
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }
  if (!path.endsWith(`.${AUDIO_EXTENSIONS[file.mimeType]}`)) {
    await discardFiles(supabase, [path]);
    return { error: "This file type is not allowed." };
  }

  const oldId = await currentAudio(supabase);
  const { data: media, error: mediaError } = await supabase
    .from("media_assets")
    .insert({
      bucket: "portfolio-files",
      object_path: path,
      kind: "other",
      mime_type: file.mimeType,
      size_bytes: file.size,
      alt_text: "Recording of how Rita's name is said",
      is_public: true,
    })
    .select("id")
    .single();
  if (mediaError || !media) {
    await discardFiles(supabase, [path]);
    return { error: "The recording could not be saved." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ pronunciation_audio_id: media.id, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) {
    await supabase.from("media_assets").delete().eq("id", media.id);
    await discardFiles(supabase, [path]);
    return { error: "The recording could not be linked." };
  }

  await discardAudio(supabase, oldId);
  refresh();
  return {};
}

export async function removePronunciationAudio(): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const oldId = await currentAudio(supabase);
  if (!oldId) return;
  const { error } = await supabase
    .from("site_settings")
    .update({ pronunciation_audio_id: null, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error("The recording could not be removed.");
  await discardAudio(supabase, oldId);
  refresh();
}
