"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { discardFiles, verifyUpload } from "@/lib/admin/uploads";
import { createClient } from "@/lib/supabase/server";
import {
  isProjectId,
  readProjectForm,
  validateProject,
  type ProjectFieldErrors,
  type ProjectFormValues,
} from "./validation";

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const PROJECT_PATH_PATTERN = /^projects\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
const PROJECT_MAX_BYTES = 5 * 1024 * 1024;

export type ProjectFormState = {
  error: string | null;
  fieldErrors: ProjectFieldErrors;
  values: ProjectFormValues | null;
};


export async function registerProjectImage(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (!isProjectId(id) || !PROJECT_PATH_PATTERN.test(path))
    return { error: "The project image could not be verified." };

  const supabase = await createClient();
  const file = await verifyUpload(supabase, path, Object.keys(EXTENSIONS), PROJECT_MAX_BYTES);
  if (!file.ok) {
    if (file.discard) await discardFiles(supabase, [path]);
    return { error: file.error };
  }
  if (!path.endsWith("." + EXTENSIONS[file.mimeType])) {
    await discardFiles(supabase, [path]);
    return { error: "This file type is not allowed." };
  }

  const { data: old } = await supabase.from("projects").select("image_id").eq("id", id).single();
  if (!old) {
    await discardFiles(supabase, [path]);
    return { error: "Project not found." };
  }

  const { data: media, error: mediaError } = await supabase.from("media_assets").insert({
    bucket: "portfolio-files", object_path: path, kind: "image", mime_type: file.mimeType,
    size_bytes: file.size, alt_text: "Project image", is_public: true,
  }).select("id").single();
  if (mediaError || !media) {
    await discardFiles(supabase, [path]);
    return { error: "The image could not be saved." };
  }

  const { error: updateError } = await supabase.from("projects")
    .update({ image_id: media.id, updated_at: new Date().toISOString() }).eq("id", id);
  if (updateError) {
    await supabase.from("media_assets").delete().eq("id", media.id);
    await discardFiles(supabase, [path]);
    return { error: "The image could not be linked." };
  }

  if (old.image_id) {
    const { data: oldMedia } = await supabase.from("media_assets").select("object_path").eq("id", old.image_id).maybeSingle();
    await supabase.from("media_assets").delete().eq("id", old.image_id);
    if (oldMedia?.object_path) await discardFiles(supabase, [oldMedia.object_path]);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return {};
}

export async function removeProjectImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isProjectId(id)) return;
  const supabase = await createClient();
  const { data: old } = await supabase.from("projects").select("image_id").eq("id", id).single();
  if (!old?.image_id) return;
  const { data: media } = await supabase.from("media_assets").select("object_path").eq("id", old.image_id).maybeSingle();
  await supabase.from("projects").update({ image_id: null, updated_at: new Date().toISOString() }).eq("id", id);
  await supabase.from("media_assets").delete().eq("id", old.image_id);
  if (media?.object_path) await discardFiles(supabase, [media.object_path]);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const values = readProjectForm(formData);

  if (!isProjectId(id)) {
    return {
      error: "This project could not be found.",
      fieldErrors: {},
      values,
    };
  }

  const result = validateProject(values);

  if (!result.ok) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: result.errors,
      values,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(result.data)
    .eq("id", id)
    .select("id");

  if (error || data?.length !== 1) {
    return {
      error: "The project could not be saved. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  redirect("/admin/projects?saved=1");
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const values = readProjectForm(formData);

  const result = validateProject(values);

  if (!result.ok) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: result.errors,
      values,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert(result.data)
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: "The project could not be created. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  redirect("/admin/projects?saved=1");
}


export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  if (!isProjectId(id)) throw new Error("This project could not be found.");
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error("The project could not be deleted.");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
