"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createProject,
  type ProjectFormState,
} from "../actions";
import type { ProjectFormValues } from "../validation";

const initialState: ProjectFormState = {
  error: null,
  fieldErrors: {},
  values: null,
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none transition focus:border-cyan-400/60";

export function ProjectCreateForm() {
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );

  const values: ProjectFormValues = state.values ?? {
    title: "",
    category: "",
    description: "",
    status: "Ongoing",
    tags: "",
    link_url: "",
    sort_order: "0",
    is_published: true,
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
          placeholder="Python, Bioinformatics, Research"
          defaultValue={values.tags}
          aria-invalid={!!errors.tags}
          className={inputClass}
        />
        <p className="mt-2 text-sm text-slate-500">
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
          className={inputClass}
        />
        <p className="mt-2 text-sm text-slate-500">
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
          {pending ? "Creating..." : "Create project"}
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