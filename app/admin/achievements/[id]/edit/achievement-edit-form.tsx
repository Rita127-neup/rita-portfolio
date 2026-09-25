"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import {
  Checkbox,
  FormFooter,
  TextArea,
  TextField,
} from "../../../_components/fields";
import { updateAchievement } from "../../actions";
import type { AchievementFormValues } from "../../validation";

export type EditableAchievement = {
  id: string;
  title: string;
  issuer: string | null;
  awarded_on: string | null;
  date_label: string | null;
  description: string | null;
  url: string | null;
  sort_order: number;
  is_published: boolean;
};

export function AchievementEditForm({
  achievement,
}: {
  achievement: EditableAchievement;
}) {
  const [state, formAction, pending] = useActionState(
    updateAchievement.bind(null, achievement.id),
    initialFormState<AchievementFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: AchievementFormValues = state.values ?? {
    title: achievement.title,
    issuer: achievement.issuer ?? "",
    awarded_on: achievement.awarded_on ?? "",
    date_label: achievement.date_label ?? "",
    description: achievement.description ?? "",
    url: achievement.url ?? "",
    sort_order: String(achievement.sort_order),
    is_published: achievement.is_published,
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

      <TextField
        name="issuer"
        label="Issuer (optional)"
        maxLength={200}
        defaultValue={values.issuer}
        error={errors.issuer}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="awarded_on"
          label="Date awarded (optional)"
          type="date"
          defaultValue={values.awarded_on}
          error={errors.awarded_on}
        />
        <TextField
          name="date_label"
          label="Date label (optional)"
          maxLength={100}
          defaultValue={values.date_label}
          error={errors.date_label}
          hint='Overrides the date, e.g. "2025".'
        />
      </div>

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
        cancelHref="/admin/achievements"
      />
    </form>
  );
}
