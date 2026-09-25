"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import {
  Checkbox,
  FormFooter,
  TextArea,
  TextField,
} from "../../../_components/fields";
import { updateExperience } from "../../actions";
import type { ExperienceFormValues } from "../../validation";

export type EditableExperience = {
  id: string;
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

export function ExperienceEditForm({
  experience,
}: {
  experience: EditableExperience;
}) {
  const [state, formAction, pending] = useActionState(
    updateExperience.bind(null, experience.id),
    initialFormState<ExperienceFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: ExperienceFormValues = state.values ?? {
    role: experience.role,
    organization: experience.organization,
    location: experience.location ?? "",
    start_date: experience.start_date ?? "",
    end_date: experience.end_date ?? "",
    is_current: experience.is_current,
    date_label: experience.date_label ?? "",
    description: experience.description ?? "",
    url: experience.url ?? "",
    tags: experience.tags.join(", "),
    sort_order: String(experience.sort_order),
    is_published: experience.is_published,
  };
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="role"
          label="Role"
          required
          maxLength={200}
          defaultValue={values.role}
          error={errors.role}
        />
        <TextField
          name="organization"
          label="Organization"
          required
          maxLength={200}
          defaultValue={values.organization}
          error={errors.organization}
        />
      </div>

      <TextField
        name="location"
        label="Location (optional)"
        maxLength={200}
        defaultValue={values.location}
        error={errors.location}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <TextField
          name="start_date"
          label="Start date (optional)"
          type="date"
          defaultValue={values.start_date}
          error={errors.start_date}
        />
        <TextField
          name="end_date"
          label="End date (optional)"
          type="date"
          defaultValue={values.end_date}
          error={errors.end_date}
        />
        <TextField
          name="date_label"
          label="Date label (optional)"
          maxLength={100}
          defaultValue={values.date_label}
          error={errors.date_label}
          hint='Overrides the dates, e.g. "Summer 2025".'
        />
      </div>

      <Checkbox
        name="is_current"
        label="I currently hold this position"
        defaultChecked={values.is_current}
      />

      <TextArea
        name="description"
        label="Description (optional)"
        maxLength={5000}
        defaultValue={values.description}
        error={errors.description}
      />

      <TextField
        name="url"
        label="Link (optional)"
        type="url"
        placeholder="https://"
        maxLength={2000}
        defaultValue={values.url}
        error={errors.url}
      />

      <TextField
        name="tags"
        label="Tags"
        defaultValue={values.tags}
        error={errors.tags}
        hint="Separate tags with commas."
      />

      <div className="max-w-xs">
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

      <Checkbox
        name="is_published"
        label="Published"
        defaultChecked={values.is_published}
      />

      <FormFooter
        error={state.error}
        pending={pending}
        cancelHref="/admin/experiences"
      />
    </form>
  );
}
