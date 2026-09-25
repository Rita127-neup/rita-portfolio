"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  readPublicationForm,
  validatePublication,
  type PublicationFormValues,
} from "./validation";

export type PublicationFormState = FormState<PublicationFormValues>;

export async function updatePublication(
  id: string,
  _prevState: PublicationFormState,
  formData: FormData,
): Promise<PublicationFormState> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  const values = readPublicationForm(formData);

  if (!isUuid(id)) {
    return {
      error: "This publication could not be found.",
      fieldErrors: {},
      values,
    };
  }

  const result = validatePublication(values);
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
    .from("publications")
    .update(result.data.publication)
    .eq("id", id)
    .select("id");

  if (error || data?.length !== 1) {
    return {
      error: "The publication could not be saved. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  // Links are matched on both ids, so only this publication's links change.
  for (const { id: linkId, ...link } of result.data.links) {
    const { data: linkData, error: linkError } = await supabase
      .from("publication_links")
      .update(link)
      .eq("id", linkId)
      .eq("publication_id", id)
      .select("id");

    if (linkError || linkData?.length !== 1) {
      revalidatePath("/admin/publications");
      revalidatePath("/publications");
      return {
        error:
          "The publication details were saved, but a link could not be saved. Please check the links and save again.",
        fieldErrors: {},
        values,
      };
    }
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
  redirect("/admin/publications?saved=1");
}
