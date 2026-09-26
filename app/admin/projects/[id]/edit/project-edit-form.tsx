"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateProject, type ProjectFormState } from "../../actions";
import type { ProjectFormValues } from "../../validation";

export type EditableProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  tags: string[];
  link_url: string | null;
  image_id: string | null;
  sort_order: number;
  is_published: boolean;
};

const initialState: ProjectFormState = {
  error: null,
  fieldErrors: {},
  values: null,
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none transition focus:border-cyan-400/60";

export function ProjectEditForm({ project }: { project: EditableProject }) {
  const [state, formAction, pending] = useActionState(
    updateProject.bind(null, project.id),
    initialState,
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: ProjectFormValues = state.values ?? {
    title: project.title,
    category: project.category,
    description: project.description,
    status: project.status,
    tags: project.tags.join(", "),
    link_url: project.link_url ?? "",
    sort_order: String(project.sort_order),
    is_published: project.is_published,
  };
  const errors = state.fieldErrors;

  function fieldError(name: keyof ProjectFormValues) {
    return errors[name] ? (
      <p id={`${name}-error`} className="mt-2 text-sm text-red-300">
        {errors[name]}
      </p>
    ) : null;
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="text-sm text-slate-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={values.title}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputClass}
        />
        {fieldError("title")}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="category" className="text-sm text-slate-300">
            Category
          </label>
          <input
            id="category"
            name="category"
            required
            maxLength={100}
            defaultValue={values.category}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={inputClass}
          />
          {fieldError("category")}
        </div>

        <div>
          <label htmlFor="status" className="text-sm text-slate-300">
            Status
          </label>
          <input
            id="status"
            name="status"
            required
            maxLength={100}
            defaultValue={values.status}
            aria-invalid={!!errors.status}
            aria-describedby={errors.status ? "status-error" : undefined}
            className={inputClass}
          />
          {fieldError("status")}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          defaultValue={values.description}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className={inputClass}
        />
        {fieldError("description")}
      </div>

      <div>
        <label htmlFor="tags" className="text-sm text-slate-300">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={values.tags}
          aria-invalid={!!errors.tags}
          aria-describedby={errors.tags ? "tags-error" : "tags-hint"}
          className={inputClass}
        />
        <p id="tags-hint" className="mt-2 text-sm text-slate-500">
          Separate tags with commas.
        </p>
        {fieldError("tags")}
      </div>

      <div>
        <label htmlFor="link_url" className="text-sm text-slate-300">
          Link (optional)
        </label>
        <input
          id="link_url"
          name="link_url"
          type="url"
          placeholder="https://"
          maxLength={2000}
          defaultValue={values.link_url}
          aria-invalid={!!errors.link_url}
          aria-describedby={errors.link_url ? "link_url-error" : undefined}
          className={inputClass}
        />
        {fieldError("link_url")}
      </div>

      <div className="max-w-xs">
        <label htmlFor="sort_order" className="text-sm text-slate-300">
          Display order
        </label>
        <input
          id="sort_order"
          name="sort_order"
          type="number"
          required
          min={0}
          max={9999}
          step={1}
          defaultValue={values.sort_order}
          aria-invalid={!!errors.sort_order}
          aria-describedby={
            errors.sort_order ? "sort_order-error" : "sort_order-hint"
          }
          className={inputClass}
        />
        <p id="sort_order-hint" className="mt-2 text-sm text-slate-500">
          Lower numbers appear first.
        </p>
        {fieldError("sort_order")}
      </div>

      <label className="flex items-center gap-3 text-slate-300">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={values.is_published}
          className="h-5 w-5 accent-cyan-400"
        />
        Published (visible on the public site)
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] transition disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <Link
          href="/admin/projects"
          className="rounded-full border border-white/10 px-6 py-3 text-slate-300 transition hover:border-cyan-400/40"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
