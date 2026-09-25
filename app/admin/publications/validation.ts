// Input validation for the publication editor. Only the columns granted in
// the admin_cms_writes migration are produced here.

import {
  checkOptional,
  checkRequired,
  isUuid,
  parseDate,
  parseHttpUrl,
  parseSortOrder,
  parseTags,
  readCheckbox,
  readText,
  type FieldErrors,
} from "@/lib/admin/form";

export const LINK_VARIANTS = ["primary", "secondary"] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

export type PublicationLinkValues = {
  id: string;
  label: string;
  url: string;
  variant: string;
  sort_order: string;
};

export type PublicationFormValues = {
  category: string;
  title: string;
  byline: string;
  summary: string;
  tags: string;
  status: string;
  doi: string;
  published_on: string;
  sort_order: string;
  is_published: boolean;
  links: PublicationLinkValues[];
};

export type PublicationUpdate = {
  category: string;
  title: string;
  byline: string;
  summary: string;
  tags: string[];
  status: string;
  doi: string | null;
  published_on: string | null;
  sort_order: number;
  is_published: boolean;
};

export type PublicationLinkUpdate = {
  id: string;
  label: string;
  url: string;
  variant: LinkVariant;
  sort_order: number;
};

export const linkField = (id: string, field: keyof PublicationLinkValues) =>
  `link_${id}_${field}`;

export function readPublicationForm(
  formData: FormData,
): PublicationFormValues {
  // Only existing links are edited; their ids arrive as hidden inputs.
  const linkIds = formData
    .getAll("link_id")
    .filter(isUuid)
    .slice(0, 20);

  return {
    category: readText(formData, "category"),
    title: readText(formData, "title"),
    byline: readText(formData, "byline"),
    summary: readText(formData, "summary"),
    tags: readText(formData, "tags"),
    status: readText(formData, "status"),
    doi: readText(formData, "doi"),
    published_on: readText(formData, "published_on"),
    sort_order: readText(formData, "sort_order"),
    is_published: readCheckbox(formData, "is_published"),
    links: linkIds.map((id) => ({
      id,
      label: readText(formData, linkField(id, "label")),
      url: readText(formData, linkField(id, "url")),
      variant: readText(formData, linkField(id, "variant")),
      sort_order: readText(formData, linkField(id, "sort_order")),
    })),
  };
}

export function validatePublication(
  values: PublicationFormValues,
):
  | {
      ok: true;
      data: { publication: PublicationUpdate; links: PublicationLinkUpdate[] };
    }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const set = (field: string, message: string | null) => {
    if (message) errors[field] = message;
  };

  set("title", checkRequired(values.title, 300));
  set("category", checkRequired(values.category, 100));
  set("status", checkRequired(values.status, 100));
  set("summary", checkRequired(values.summary, 5000));
  set("byline", checkOptional(values.byline, 300));

  const tags = parseTags(values.tags);
  if (!tags.ok) errors.tags = tags.error;

  let doi: string | null = null;
  if (values.doi) {
    if (!/^10\.\d{4,9}\/\S{1,200}$/.test(values.doi))
      errors.doi = "Enter a DOI like 10.5281/zenodo.123 (without https://doi.org/).";
    else doi = values.doi;
  }

  const publishedOn = parseDate(values.published_on);
  if (!publishedOn.ok) errors.published_on = publishedOn.error;

  const sortOrder = parseSortOrder(values.sort_order);
  if (!sortOrder.ok) errors.sort_order = sortOrder.error;

  const links: PublicationLinkUpdate[] = [];
  for (const link of values.links) {
    const labelError = checkRequired(link.label, 100);
    if (labelError) errors[linkField(link.id, "label")] = labelError;

    const url = parseHttpUrl(link.url);
    if (!url.ok) errors[linkField(link.id, "url")] = url.error;
    else if (!url.url)
      errors[linkField(link.id, "url")] = "This field is required.";

    const variant = LINK_VARIANTS.find((v) => v === link.variant);
    if (!variant) errors[linkField(link.id, "variant")] = "Choose a style.";

    const order = parseSortOrder(link.sort_order);
    if (!order.ok) errors[linkField(link.id, "sort_order")] = order.error;

    if (!labelError && url.ok && url.url && variant && order.ok) {
      links.push({
        id: link.id,
        label: link.label,
        url: url.url,
        variant,
        sort_order: order.order,
      });
    }
  }

  // The public page keys links by label, so labels must be unique per
  // publication.
  const labels = values.links.map((link) => link.label.toLowerCase());
  values.links.forEach((link, index) => {
    if (link.label && labels.indexOf(link.label.toLowerCase()) !== index)
      errors[linkField(link.id, "label")] = "Each link needs a different label.";
  });

  if (
    Object.keys(errors).length > 0 ||
    !tags.ok ||
    !publishedOn.ok ||
    !sortOrder.ok
  )
    return { ok: false, errors };

  return {
    ok: true,
    data: {
      publication: {
        category: values.category,
        title: values.title,
        byline: values.byline,
        summary: values.summary,
        tags: tags.tags,
        status: values.status,
        doi,
        published_on: publishedOn.date,
        sort_order: sortOrder.order,
        is_published: values.is_published,
      },
      links,
    },
  };
}
