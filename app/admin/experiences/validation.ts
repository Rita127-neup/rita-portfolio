// Input validation for the experience editor. Only the columns granted in the
// admin_cms_writes migration are produced here.

import {
  checkOptional,
  checkRequired,
  parseDate,
  parseHttpUrl,
  parseSortOrder,
  parseTags,
  readCheckbox,
  readText,
  type FieldErrors,
} from "@/lib/admin/form";

export type ExperienceFormValues = {
  role: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  date_label: string;
  description: string;
  url: string;
  tags: string;
  sort_order: string;
  is_published: boolean;
};

export type ExperienceUpdate = {
  role: string;
  organization: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  date_label: string | null;
  description: string | null;
  url: string | null;
  tags: string[];
  sort_order: number;
  is_published: boolean;
};

export function readExperienceForm(formData: FormData): ExperienceFormValues {
  return {
    role: readText(formData, "role"),
    organization: readText(formData, "organization"),
    location: readText(formData, "location"),
    start_date: readText(formData, "start_date"),
    end_date: readText(formData, "end_date"),
    is_current: readCheckbox(formData, "is_current"),
    date_label: readText(formData, "date_label"),
    description: readText(formData, "description"),
    url: readText(formData, "url"),
    tags: readText(formData, "tags"),
    sort_order: readText(formData, "sort_order"),
    is_published: readCheckbox(formData, "is_published"),
  };
}

export function validateExperience(
  values: ExperienceFormValues,
): { ok: true; data: ExperienceUpdate } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("role", checkRequired(values.role, 200));
  set("organization", checkRequired(values.organization, 200));
  set("location", checkOptional(values.location, 200));
  set("date_label", checkOptional(values.date_label, 100));
  set("description", checkOptional(values.description, 5000));

  const start = parseDate(values.start_date);
  if (!start.ok) errors.start_date = start.error;
  const end = parseDate(values.end_date);
  if (!end.ok) errors.end_date = end.error;
  if (start.ok && end.ok && start.date && end.date && end.date < start.date)
    errors.end_date = "The end date must be after the start date.";
  if (values.is_current && end.ok && end.date)
    errors.end_date = "Leave the end date empty for a current position.";

  const url = parseHttpUrl(values.url);
  if (!url.ok) errors.url = url.error;

  const tags = parseTags(values.tags);
  if (!tags.ok) errors.tags = tags.error;

  const sortOrder = parseSortOrder(values.sort_order);
  if (!sortOrder.ok) errors.sort_order = sortOrder.error;

  if (
    Object.keys(errors).length > 0 ||
    !start.ok ||
    !end.ok ||
    !url.ok ||
    !tags.ok ||
    !sortOrder.ok
  )
    return { ok: false, errors };

  return {
    ok: true,
    data: {
      role: values.role,
      organization: values.organization,
      location: values.location || null,
      start_date: start.date,
      end_date: end.date,
      is_current: values.is_current,
      date_label: values.date_label || null,
      description: values.description || null,
      url: url.url,
      tags: tags.tags,
      sort_order: sortOrder.order,
      is_published: values.is_published,
    },
  };
}
