// Input validation for site settings, social links and page text. Only the
// columns granted in the admin_cms_writes migration are produced here.

import {
  checkRequired,
  isEmail,
  isUuid,
  parseHref,
  parseHttpUrl,
  parseSortOrder,
  readCheckbox,
  readText,
  type FieldErrors,
} from "@/lib/admin/form";
import type { PageConfig, SectionField } from "./page-config";

// Site settings ---------------------------------------------------------------

export type SiteSettingsFormValues = {
  brand_mark: string;
  meta_title: string;
  meta_description: string;
  contact_email: string;
  nav_cta_label: string;
  nav_cta_href: string;
};

export function readSiteSettingsForm(
  formData: FormData,
): SiteSettingsFormValues {
  return {
    brand_mark: readText(formData, "brand_mark"),
    meta_title: readText(formData, "meta_title"),
    meta_description: readText(formData, "meta_description"),
    contact_email: readText(formData, "contact_email"),
    nav_cta_label: readText(formData, "nav_cta_label"),
    nav_cta_href: readText(formData, "nav_cta_href"),
  };
}

export function validateSiteSettings(
  values: SiteSettingsFormValues,
):
  | { ok: true; data: SiteSettingsFormValues }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("brand_mark", checkRequired(values.brand_mark, 20));
  set("meta_title", checkRequired(values.meta_title, 200));
  set("meta_description", checkRequired(values.meta_description, 500));
  set("nav_cta_label", checkRequired(values.nav_cta_label, 50));
  if (!values.contact_email) errors.contact_email = "This field is required.";
  else if (!isEmail(values.contact_email))
    errors.contact_email = "Enter a valid email address.";

  const href = parseHref(values.nav_cta_href);
  if (!href.ok) errors.nav_cta_href = href.error;

  if (Object.keys(errors).length > 0 || !href.ok) return { ok: false, errors };
  return { ok: true, data: { ...values, nav_cta_href: href.href } };
}

// Social links ----------------------------------------------------------------

export type SocialLinkValues = {
  id: string;
  label: string;
  url: string;
  sort_order: string;
  is_visible: boolean;
};

export type SocialLinkUpdate = {
  id: string;
  label: string;
  url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export const socialField = (id: string, field: keyof SocialLinkValues) =>
  `social_${id}_${field}`;

export function readSocialLinksForm(formData: FormData): SocialLinkValues[] {
  return formData
    .getAll("social_id")
    .filter(isUuid)
    .slice(0, 20)
    .map((id) => ({
      id,
      label: readText(formData, socialField(id, "label")),
      url: readText(formData, socialField(id, "url")),
      sort_order: readText(formData, socialField(id, "sort_order")),
      is_visible: readCheckbox(formData, socialField(id, "is_visible")),
    }));
}

export function validateSocialLinks(
  values: SocialLinkValues[],
): { ok: true; data: SocialLinkUpdate[] } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const data: SocialLinkUpdate[] = [];
  const labels = values.map((link) => link.label.toLowerCase());

  values.forEach((link, index) => {
    let labelError = checkRequired(link.label, 50);
    if (!labelError && labels.indexOf(link.label.toLowerCase()) !== index)
      labelError = "Each link needs a different label.";
    if (labelError) errors[socialField(link.id, "label")] = labelError;

    const url = parseHttpUrl(link.url);
    if (!url.ok) errors[socialField(link.id, "url")] = url.error;

    const order = parseSortOrder(link.sort_order);
    if (!order.ok) errors[socialField(link.id, "sort_order")] = order.error;

    if (!labelError && url.ok && order.ok) {
      data.push({
        id: link.id,
        label: link.label,
        url: url.url,
        sort_order: order.order,
        is_visible: link.is_visible,
      });
    }
  });

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data };
}

// Page text -------------------------------------------------------------------

export type PageSectionValues = {
  id: string;
  section_key: string;
  heading: string;
  body: string;
  button_label: string;
};

export type PageLinkValues = { id: string; label: string; href: string };

export type PageFormValues = {
  eyebrow: string;
  title: string;
  title_muted: string;
  intro: string;
  sections: PageSectionValues[];
  links: PageLinkValues[];
};

export type PageUpdate = {
  page: { eyebrow: string; title: string; intro: string; title_muted?: string | null };
  sections: { id: string; fields: Partial<Record<SectionField, string>> }[];
  links: { id: string; label: string; href: string }[];
};

export const sectionField = (id: string, field: SectionField) =>
  `section_${id}_${field}`;
export const pageLinkField = (id: string, field: "label" | "href") =>
  `pagelink_${id}_${field}`;

/**
 * Reads the page form. Section and link ids come from the database (the
 * caller passes the rows that belong to this page), never from the form.
 */
export function readPageForm(
  formData: FormData,
  sections: { id: string; section_key: string }[],
  links: { id: string }[],
): PageFormValues {
  return {
    eyebrow: readText(formData, "eyebrow"),
    title: readText(formData, "title"),
    title_muted: readText(formData, "title_muted"),
    intro: readText(formData, "intro"),
    sections: sections.map((section) => ({
      id: section.id,
      section_key: section.section_key,
      heading: readText(formData, sectionField(section.id, "heading")),
      body: readText(formData, sectionField(section.id, "body")),
      button_label: readText(formData, sectionField(section.id, "button_label")),
    })),
    links: links.map((link) => ({
      id: link.id,
      label: readText(formData, pageLinkField(link.id, "label")),
      href: readText(formData, pageLinkField(link.id, "href")),
    })),
  };
}

const SECTION_LIMITS: Record<SectionField, number> = {
  heading: 200,
  body: 2000,
  button_label: 50,
};

export function validatePage(
  values: PageFormValues,
  config: PageConfig,
): { ok: true; data: PageUpdate } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("eyebrow", checkRequired(values.eyebrow, 100));
  set("title", checkRequired(values.title, 200));
  set("intro", checkRequired(values.intro, 2000));

  const page: PageUpdate["page"] = {
    eyebrow: values.eyebrow,
    title: values.title,
    intro: values.intro,
  };
  if (config.muted === "required") {
    set("title_muted", checkRequired(values.title_muted, 200));
    page.title_muted = values.title_muted;
  } else if (config.muted === "optional") {
    if (values.title_muted.length > 200)
      errors.title_muted = "Keep this under 200 characters.";
    page.title_muted = values.title_muted || null;
  }

  const sections: PageUpdate["sections"] = [];
  for (const section of values.sections) {
    const sectionConfig = config.sections[section.section_key];
    if (!sectionConfig) continue;
    const fields: Partial<Record<SectionField, string>> = {};
    for (const field of Object.keys(sectionConfig.fields) as SectionField[]) {
      const name = sectionField(section.id, field);
      const error = checkRequired(section[field], SECTION_LIMITS[field]);
      if (error) errors[name] = error;
      else fields[field] = section[field];
    }
    sections.push({ id: section.id, fields });
  }

  const links: PageUpdate["links"] = [];
  if (config.links) {
    for (const link of values.links) {
      const labelError = checkRequired(link.label, 100);
      if (labelError) errors[pageLinkField(link.id, "label")] = labelError;
      const href = parseHref(link.href);
      if (!href.ok) errors[pageLinkField(link.id, "href")] = href.error;
      if (!labelError && href.ok)
        links.push({ id: link.id, label: link.label, href: href.href });
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { page, sections, links } };
}
