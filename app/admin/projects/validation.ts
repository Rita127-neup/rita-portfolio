// Input validation for the project editor. Shared by the edit page and the
// save action; the database constraints remain the final check.

import { parseSortOrder } from "@/lib/admin/form";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isProjectId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

// Only these columns may be updated (see the admin_update_projects and
// admin_cms_writes migrations).
export type ProjectUpdate = {
  title: string;
  category: string;
  description: string;
  status: string;
  tags: string[];
  link_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export type ProjectFormValues = {
  title: string;
  category: string;
  description: string;
  status: string;
  tags: string;
  link_url: string;
  sort_order: string;
  is_published: boolean;
};

export type ProjectFieldErrors = Partial<
  Record<keyof ProjectFormValues, string>
>;

const LIMITS = {
  title: 200,
  category: 100,
  description: 5000,
  status: 100,
  tag: 50,
  tags: 20,
  link_url: 2000,
};

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function readProjectForm(formData: FormData): ProjectFormValues {
  return {
    title: text(formData, "title"),
    category: text(formData, "category"),
    description: text(formData, "description"),
    status: text(formData, "status"),
    tags: text(formData, "tags"),
    link_url: text(formData, "link_url"),
    sort_order: text(formData, "sort_order"),
    is_published: formData.get("is_published") === "on",
  };
}

export function validateProject(
  values: ProjectFormValues,
):
  | { ok: true; data: ProjectUpdate }
  | { ok: false; errors: ProjectFieldErrors } {
  const errors: ProjectFieldErrors = {};

  const required = ["title", "category", "description", "status"] as const;
  for (const field of required) {
    if (!values[field]) errors[field] = "This field is required.";
    else if (values[field].length > LIMITS[field])
      errors[field] = `Keep this under ${LIMITS[field]} characters.`;
  }

  const tags = [
    ...new Set(
      values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
  if (tags.length > LIMITS.tags)
    errors.tags = `Use at most ${LIMITS.tags} tags.`;
  else if (tags.some((tag) => tag.length > LIMITS.tag))
    errors.tags = `Keep each tag under ${LIMITS.tag} characters.`;

  let linkUrl: string | null = null;
  if (values.link_url) {
    if (values.link_url.length > LIMITS.link_url) {
      errors.link_url = `Keep this under ${LIMITS.link_url} characters.`;
    } else if (!/^https?:\/\//i.test(values.link_url)) {
      errors.link_url = "Links must start with http:// or https://.";
    } else {
      try {
        new URL(values.link_url);
        linkUrl = values.link_url;
      } catch {
        errors.link_url = "Enter a valid URL.";
      }
    }
  }

  const sortOrder = parseSortOrder(values.sort_order);
  if (!sortOrder.ok) errors.sort_order = sortOrder.error;

  if (Object.keys(errors).length > 0 || !sortOrder.ok)
    return { ok: false, errors };

  return {
    ok: true,
    data: {
      title: values.title,
      category: values.category,
      description: values.description,
      status: values.status,
      tags,
      link_url: linkUrl,
      sort_order: sortOrder.order,
      is_published: values.is_published,
    },
  };
}
