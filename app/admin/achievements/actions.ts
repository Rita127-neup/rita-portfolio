"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  readAchievementForm,
  validateAchievement,
  type AchievementFormValues,
} from "./validation";

export type AchievementFormState = FormState<AchievementFormValues>;

export async function updateAchievement(
  id: string,
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  const values = readAchievementForm(formData);

  if (!isUuid(id)) {
    return {
      error: "This achievement could not be found.",
      fieldErrors: {},
      values,
    };
  }

  const result = validateAchievement(values);
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
    .from("achievements")
    .update(result.data)
    .eq("id", id)
    .select("id");

  if (error || data?.length !== 1) {
    return {
      error: "The achievement could not be saved. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  // Achievements are not shown on any public page yet, so only the admin list
  // needs refreshing.
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements?saved=1");
}


export async function createAchievement(
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  await requireAdmin();
  const values = readAchievementForm(formData);
  const result = validateAchievement(values);
  if (!result.ok) return { error: "Please fix the highlighted fields.", fieldErrors: result.errors, values };
  const supabase = await createClient();
  const { data, error } = await supabase.from("achievements").insert(result.data).select("id").single();
  if (error || !data) return { error: "The achievement could not be created. Please try again.", fieldErrors: {}, values };
  revalidatePath("/admin/achievements");
  redirect("/admin/achievements?saved=1");
}

export async function deleteAchievement(id: string): Promise<void> {
  await requireAdmin();
  if (!isUuid(id)) throw new Error("This achievement could not be found.");
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw new Error("The achievement could not be deleted.");
  revalidatePath("/admin/achievements");
}
