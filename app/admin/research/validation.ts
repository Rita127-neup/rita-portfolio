// Input validation for the research editor. Only the columns granted in the
// admin_cms_writes migration are produced here.

import {
  checkRequired,
  parseSortOrder,
  parseTags,
  readCheckbox,
  readText,
  type FieldErrors,
} from "@/lib/admin/form";

export type ResearchFormValues = {
  category: string;
  title: string;
  summary: string;
  tags: string;
  sort_order: string;
  is_published: boolean;
};

export type ResearchUpdate = {
  category: string;
  title: string;
  summary: string;
  tags: string[];
  sort_order: number;
  is_published: boolean;
};

export function readResearchForm(formData: FormData): ResearchFormValues {
  return {
    category: readText(formData, "category"),
    title: readText(formData, "title"),
    summary: readText(formData, "summary"),
    tags: readText(formData, "tags"),
    sort_order: readText(formData, "sort_order"),
    is_published: readCheckbox(formData, "is_published"),
  };
}

export function validateResearch(
  values: ResearchFormValues,
): { ok: true; data: ResearchUpdate } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("title", checkRequired(values.title, 300));
  set("category", checkRequired(values.category, 100));
  set("summary", checkRequired(values.summary, 5000));

  const tags = parseTags(values.tags);
  if (!tags.ok) errors.tags = tags.error;

  const sortOrder = parseSortOrder(values.sort_order);
  if (!sortOrder.ok) errors.sort_order = sortOrder.error;

  if (Object.keys(errors).length > 0 || !tags.ok || !sortOrder.ok)
    return { ok: false, errors };

  return {
    ok: true,
    data: {
      category: values.category,
      title: values.title,
      summary: values.summary,
      tags: tags.tags,
      sort_order: sortOrder.order,
      is_published: values.is_published,
    },
  };
}
