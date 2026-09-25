"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import {
  Checkbox,
  FormFooter,
  TextArea,
  TextField,
} from "../../../_components/fields";
import { updateResearchItem } from "../../actions";
import type { ResearchFormValues } from "../../validation";

export type EditableResearch = {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  sort_order: number;
  is_published: boolean;
};

export function ResearchEditForm({ item }: { item: EditableResearch }) {
  const [state, formAction, pending] = useActionState(
    updateResearchItem.bind(null, item.id),
    initialFormState<ResearchFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: ResearchFormValues = state.values ?? {
    category: item.category,
    title: item.title,
    summary: item.summary,
    tags: item.tags.join(", "),
    sort_order: String(item.sort_order),
    is_published: item.is_published,
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
        name="category"
        label="Category"
        required
        maxLength={100}
        defaultValue={values.category}
        error={errors.category}
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
        label="Published (visible on the public site)"
        defaultChecked={values.is_published}
      />
      <FormFooter
        error={state.error}
        pending={pending}
        cancelHref="/admin/research"
      />
    </form>
  );
}
