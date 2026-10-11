"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  readResearchForm,
  validateResearch,
  type ResearchFormValues,
} from "./validation";

export type ResearchFormState = FormState<ResearchFormValues>;

export async function updateResearchItem(
  id: string,
  _prevState: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  const values = readResearchForm(formData);

  if (!isUuid(id)) {
    return {
      error: "This research item could not be found.",
      fieldErrors: {},
      values,
    };
  }

  const result = validateResearch(values);
  if (!result.ok) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: result.errors,
      values,
    };
  }

  // Runs as the signed-in admin; RLS and column privileges limit what can
  // change.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research_items")
    .update(result.data)
    .eq("id", id)
    .select("id");

  if (error || data?.length !== 1) {
    return {
      error: "The research item could not be saved. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/research");
  revalidatePath("/research");
  redirect("/admin/research?saved=1");
}


export async function createResearchItem(
  _prevState: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  await requireAdmin();
  const values = readResearchForm(formData);
  const result = validateResearch(values);
  if (!result.ok) return { error: "Please fix the highlighted fields.", fieldErrors: result.errors, values };
  const supabase = await createClient();

  // Generate the required unique slug from the title; admins should not need to enter it manually.
  const baseSlug = values.title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
  if (!baseSlug) {
    return { error: "Please use a title containing letters or numbers.", fieldErrors: { title: "A title with letters or numbers is required." }, values };
  }

  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const { data: existing, error: slugError } = await supabase
      .from("research_items")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (slugError) {
      return { error: "Could not check the research item URL. Please try again.", fieldErrors: {}, values };
    }
    if (!existing) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const { data, error } = await supabase
    .from("research_items")
    .insert({ ...result.data, slug })
    .select("id")
    .single();
  if (error || !data) return { error: "The research item could not be created. Please try again.", fieldErrors: {}, values };
  revalidatePath("/admin/research");
  revalidatePath("/research");
  redirect("/admin/research?saved=1");
}

export async function deleteResearchItem(id: string): Promise<void> {
  await requireAdmin();
  if (!isUuid(id)) throw new Error("This research item could not be found.");
  const supabase = await createClient();
  const { error } = await supabase.from("research_items").delete().eq("id", id);
  if (error) throw new Error("The research item could not be deleted.");
  revalidatePath("/admin/research");
  revalidatePath("/research");
}
