"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import {
  Checkbox,
  FormFooter,
  SelectField,
  TextArea,
  TextField,
} from "../../../_components/fields";
import { updatePublication } from "../../actions";
import { linkField, type PublicationFormValues } from "../../validation";

export type EditablePublication = {
  id: string;
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
  links: {
    id: string;
    label: string;
    url: string;
    variant: string;
    sort_order: number;
  }[];
};

const variantOptions = [
  { value: "primary", label: "Primary (cyan)" },
  { value: "secondary", label: "Secondary (grey)" },
];

export function PublicationEditForm({
  publication,
}: {
  publication: EditablePublication;
}) {
  const [state, formAction, pending] = useActionState(
    updatePublication.bind(null, publication.id),
    initialFormState<PublicationFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: PublicationFormValues = state.values ?? {
    category: publication.category,
    title: publication.title,
    byline: publication.byline,
    summary: publication.summary,
    tags: publication.tags.join(", "),
    status: publication.status,
    doi: publication.doi ?? "",
    published_on: publication.published_on ?? "",
    sort_order: String(publication.sort_order),
    is_published: publication.is_published,
    links: publication.links.map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      variant: link.variant,
      sort_order: String(link.sort_order),
    })),
  };
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      <TextField
        name="title"
        label="Title"
        required
        maxLength={300}
        defaultValue={values.title}
        error={errors.title}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="category"
          label="Category"
          required
          maxLength={100}
          defaultValue={values.category}
          error={errors.category}
        />
        <TextField
          name="status"
          label="Status"
          required
          maxLength={100}
          defaultValue={values.status}
          error={errors.status}
        />
      </div>

      <TextField
        name="byline"
        label="Byline"
        maxLength={300}
        defaultValue={values.byline}
        error={errors.byline}
        hint="Shown under the title, e.g. your authorship role."
      />

      <TextArea
        name="summary"
        label="Summary"
        required
        maxLength={5000}
        defaultValue={values.summary}
        error={errors.summary}
      />

      <TextField
        name="tags"
        label="Tags"
        defaultValue={values.tags}
        error={errors.tags}
        hint="Separate tags with commas."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <TextField
          name="doi"
          label="DOI (optional)"
          maxLength={210}
          defaultValue={values.doi}
          error={errors.doi}
          hint="Not shown on the public page."
        />
        <TextField
          name="published_on"
          label="Publication date (optional)"
          type="date"
          defaultValue={values.published_on}
          error={errors.published_on}
          hint="Not shown on the public page."
        />
        <TextField
          name="sort_order"
          label="Display order"
          type="number"
          required
          defaultValue={values.sort_order}
          error={errors.sort_order}
          hint="Lower numbers appear first."
        />
      </div>

      <fieldset className="space-y-4 rounded-2xl border border-white/10 p-6">
        <legend className="px-2 text-sm text-slate-300">Links</legend>
        {values.links.length === 0 ? (
          <p className="text-sm text-slate-500">This publication has no links.</p>
        ) : (
          values.links.map((link, index) => (
            <div
              key={link.id}
              className="space-y-4 border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
            >
              <input type="hidden" name="link_id" value={link.id} />
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Link {index + 1}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  name={linkField(link.id, "label")}
                  label="Label"
                  required
                  maxLength={100}
                  defaultValue={link.label}
                  error={errors[linkField(link.id, "label")]}
                />
                <TextField
                  name={linkField(link.id, "url")}
                  label="URL"
                  type="url"
                  required
                  maxLength={2000}
                  placeholder="https://"
                  defaultValue={link.url}
                  error={errors[linkField(link.id, "url")]}
                />
                <SelectField
                  name={linkField(link.id, "variant")}
                  label="Style"
                  options={variantOptions}
                  defaultValue={link.variant}
                  error={errors[linkField(link.id, "variant")]}
                />
                <TextField
                  name={linkField(link.id, "sort_order")}
                  label="Link order"
                  type="number"
                  required
                  defaultValue={link.sort_order}
                  error={errors[linkField(link.id, "sort_order")]}
                />
              </div>
            </div>
          ))
        )}
      </fieldset>

      <Checkbox
        name="is_published"
        label="Published (visible on the public site)"
        defaultChecked={values.is_published}
      />

      <FormFooter
        error={state.error}
        pending={pending}
        cancelHref="/admin/publications"
      />
    </form>
  );
}
