"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  readExperienceForm,
  validateExperience,
  type ExperienceFormValues,
} from "./validation";

export type ExperienceFormState = FormState<ExperienceFormValues>;

export async function updateExperience(
  id: string,
  _prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  const values = readExperienceForm(formData);

  if (!isUuid(id)) {
    return {
      error: "This experience could not be found.",
      fieldErrors: {},
      values,
    };
  }

  const result = validateExperience(values);
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
    .from("experiences")
    .update(result.data)
    .eq("id", id)
    .select("id");

  if (error || data?.length !== 1) {
    return {
      error: "The experience could not be saved. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  // Experiences are not shown on any public page yet, so only the admin list
  // needs refreshing.
  revalidatePath("/admin/experiences");
  redirect("/admin/experiences?saved=1");
}
