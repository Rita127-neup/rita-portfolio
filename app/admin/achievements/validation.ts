// Input validation for the achievement editor. Only the columns granted in
// the admin_cms_writes migration are produced here.

import {
  checkOptional,
  checkRequired,
  parseDate,
  parseHttpUrl,
  parseSortOrder,
  readCheckbox,
  readText,
  type FieldErrors,
} from "@/lib/admin/form";

export type AchievementFormValues = {
  title: string;
  issuer: string;
  awarded_on: string;
  date_label: string;
  description: string;
  url: string;
  sort_order: string;
  is_published: boolean;
};

export type AchievementUpdate = {
  title: string;
  issuer: string | null;
  awarded_on: string | null;
  date_label: string | null;
  description: string | null;
  url: string | null;
  sort_order: number;
  is_published: boolean;
};

export function readAchievementForm(formData: FormData): AchievementFormValues {
  return {
    title: readText(formData, "title"),
    issuer: readText(formData, "issuer"),
    awarded_on: readText(formData, "awarded_on"),
    date_label: readText(formData, "date_label"),
    description: readText(formData, "description"),
    url: readText(formData, "url"),
    sort_order: readText(formData, "sort_order"),
    is_published: readCheckbox(formData, "is_published"),
  };
}

export function validateAchievement(
  values: AchievementFormValues,
): { ok: true; data: AchievementUpdate } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("title", checkRequired(values.title, 300));
  set("issuer", checkOptional(values.issuer, 200));
  set("date_label", checkOptional(values.date_label, 100));
  set("description", checkOptional(values.description, 5000));

  const awardedOn = parseDate(values.awarded_on);
  if (!awardedOn.ok) errors.awarded_on = awardedOn.error;

  const url = parseHttpUrl(values.url);
  if (!url.ok) errors.url = url.error;

  const sortOrder = parseSortOrder(values.sort_order);
  if (!sortOrder.ok) errors.sort_order = sortOrder.error;

  if (
    Object.keys(errors).length > 0 ||
    !awardedOn.ok ||
    !url.ok ||
    !sortOrder.ok
  )
    return { ok: false, errors };

  return {
    ok: true,
    data: {
      title: values.title,
      issuer: values.issuer || null,
      awarded_on: awardedOn.date,
      date_label: values.date_label || null,
      description: values.description || null,
      url: url.url,
      sort_order: sortOrder.order,
      is_published: values.is_published,
    },
  };
}
