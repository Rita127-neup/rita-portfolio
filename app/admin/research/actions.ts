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
