"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  isProjectId,
  readProjectForm,
  validateProject,
  type ProjectFieldErrors,
  type ProjectFormValues,
} from "./validation";

export type ProjectFormState = {
  error: string | null;
  fieldErrors: ProjectFieldErrors;
  values: ProjectFormValues | null;
};

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
