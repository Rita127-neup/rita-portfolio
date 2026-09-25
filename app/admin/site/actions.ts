"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUuid, type FormState } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PAGE_CONFIG } from "./page-config";
import {
  readPageForm,
  readSiteSettingsForm,
  readSocialLinksForm,
  validatePage,
  validateSiteSettings,
  validateSocialLinks,
  type PageFormValues,
  type SiteSettingsFormValues,
  type SocialLinkValues,
} from "./validation";

export type SiteSettingsFormState = FormState<SiteSettingsFormValues>;
export type SocialLinksFormState = FormState<SocialLinkValues[]>;
export type PageFormState = FormState<PageFormValues>;

const saveFailed = "Your changes could not be saved. Please try again.";

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  // Server Functions are reachable by direct POST, so authorize here too.
  await requireAdmin();

  const values = readSiteSettingsForm(formData);
  const result = validateSiteSettings(values);
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
    .from("site_settings")
    .update(result.data)
    .eq("id", 1)
    .select("id");

  if (error || data?.length !== 1)
    return { error: saveFailed, fieldErrors: {}, values };

  // Settings appear in the shared layout (brand, navigation button, page
  // title) and on the contact page, so refresh every public page.
  revalidatePath("/", "layout");
  redirect("/admin/site?saved=settings");
}

export async function updateSocialLinks(
  _prevState: SocialLinksFormState,
  formData: FormData,
): Promise<SocialLinksFormState> {
  await requireAdmin();

  const values = readSocialLinksForm(formData);
  const result = validateSocialLinks(values);
  if (!result.ok) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: result.errors,
      values,
    };
  }

  const supabase = await createClient();
  for (const { id, ...link } of result.data) {
    const { data, error } = await supabase
      .from("social_links")
      .update(link)
      .eq("id", id)
      .select("id");

    if (error || data?.length !== 1) {
      revalidatePath("/", "layout");
      return {
        error: `The ${link.label} link could not be saved. Please try again.`,
        fieldErrors: {},
        values,
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin/site?saved=social");
}

export async function updatePage(
  id: string,
  _prevState: PageFormState,
  formData: FormData,
): Promise<PageFormState> {
  await requireAdmin();

  const notFound = {
    error: "This page could not be found.",
    fieldErrors: {},
    values: null,
  };
  if (!isUuid(id)) return notFound;

  const supabase = await createClient();

  // The page, its sections and its links are looked up from the database, so
  // the form can only change rows that belong to this page.
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select(
      "slug, sections:page_sections(id, section_key), links:page_links(id)",
    )
    .eq("id", id)
    .maybeSingle<{
      slug: string;
      sections: { id: string; section_key: string }[];
      links: { id: string }[];
    }>();

  if (pageError) return { ...notFound, error: saveFailed };
  const config = page ? PAGE_CONFIG[page.slug] : undefined;
  if (!page || !config) return notFound;

  const sections = page.sections.filter(
    (section) => section.section_key in config.sections,
  );
  const links = config.links ? page.links : [];
  const values = readPageForm(formData, sections, links);

  const result = validatePage(values, config);
  if (!result.ok) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: result.errors,
      values,
    };
  }

  const { data, error } = await supabase
    .from("pages")
    .update(result.data.page)
    .eq("id", id)
    .select("id");
  if (error || data?.length !== 1)
    return { error: saveFailed, fieldErrors: {}, values };

  const partial = {
    error:
      "The page header was saved, but some page text could not be saved. Please try again.",
    fieldErrors: {},
    values,
  };

  for (const section of result.data.sections) {
    const { data, error } = await supabase
      .from("page_sections")
      .update(section.fields)
      .eq("id", section.id)
      .eq("page_id", id)
      .select("id");
    if (error || data?.length !== 1) {
      revalidatePath(config.path);
      return partial;
    }
  }

  for (const { id: linkId, ...link } of result.data.links) {
    const { data, error } = await supabase
      .from("page_links")
      .update(link)
      .eq("id", linkId)
      .eq("page_id", id)
      .select("id");
    if (error || data?.length !== 1) {
      revalidatePath(config.path);
      return partial;
    }
  }

  revalidatePath(config.path);
  redirect("/admin/site?saved=page");
}
