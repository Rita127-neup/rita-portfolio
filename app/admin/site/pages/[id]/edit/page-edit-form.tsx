"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import { FormFooter, TextArea, TextField } from "../../../../_components/fields";
import { updatePage } from "../../../actions";
import type { PageConfig, SectionField } from "../../../page-config";
import {
  pageLinkField,
  sectionField,
  type PageFormValues,
} from "../../../validation";

export type EditablePage = {
  id: string;
  eyebrow: string;
  title: string;
  title_muted: string | null;
  intro: string;
  sections: {
    id: string;
    section_key: string;
    heading: string | null;
    body: string | null;
    button_label: string | null;
  }[];
  links: { id: string; label: string; href: string }[];
};

export function PageEditForm({
  page,
  config,
}: {
  page: EditablePage;
  config: PageConfig;
}) {
  const [state, formAction, pending] = useActionState(
    updatePage.bind(null, page.id),
    initialFormState<PageFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values: PageFormValues = state.values ?? {
    eyebrow: page.eyebrow,
    title: page.title,
    title_muted: page.title_muted ?? "",
    intro: page.intro,
    sections: page.sections.map((section) => ({
      id: section.id,
      section_key: section.section_key,
      heading: section.heading ?? "",
      body: section.body ?? "",
      button_label: section.button_label ?? "",
    })),
    links: page.links,
  };
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      <TextField
        name="eyebrow"
        label="Small heading above the title"
        required
        maxLength={100}
        defaultValue={values.eyebrow}
        error={errors.eyebrow}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="title"
          label={config.titleLabel}
          required
          maxLength={200}
          defaultValue={values.title}
          error={errors.title}
        />
        {config.muted && (
          <TextField
            name="title_muted"
            label={config.mutedLabel ?? "Second title line"}
            required={config.muted === "required"}
            maxLength={200}
            defaultValue={values.title_muted}
            error={errors.title_muted}
          />
        )}
      </div>

      <TextArea
        name="intro"
        label="Introduction"
        required
        rows={4}
        maxLength={2000}
        defaultValue={values.intro}
        error={errors.intro}
      />

      {values.sections.map((section) => {
        const sectionConfig = config.sections[section.section_key];
        if (!sectionConfig) return null;
        return (
          <fieldset
            key={section.id}
            className="space-y-4 rounded-2xl border border-white/10 p-6"
          >
            <legend className="px-2 text-sm text-slate-300">
              {sectionConfig.name}
            </legend>
            {(Object.keys(sectionConfig.fields) as SectionField[]).map(
              (field) =>
                field === "body" ? (
                  <TextArea
                    key={field}
                    name={sectionField(section.id, field)}
                    label={sectionConfig.fields[field] ?? field}
                    required
                    rows={3}
                    maxLength={2000}
                    defaultValue={section[field]}
                    error={errors[sectionField(section.id, field)]}
                  />
                ) : (
                  <TextField
                    key={field}
                    name={sectionField(section.id, field)}
                    label={sectionConfig.fields[field] ?? field}
                    required
                    maxLength={field === "heading" ? 200 : 50}
                    defaultValue={section[field]}
                    error={errors[sectionField(section.id, field)]}
                  />
                ),
            )}
          </fieldset>
        );
      })}

      {values.links.length > 0 && (
        <fieldset className="space-y-4 rounded-2xl border border-white/10 p-6">
          <legend className="px-2 text-sm text-slate-300">Buttons</legend>
          {values.links.map((link, index) => (
            <div key={link.id} className="grid gap-4 md:grid-cols-2">
              <TextField
                name={pageLinkField(link.id, "label")}
                label={`Button ${index + 1} label`}
                required
                maxLength={100}
                defaultValue={link.label}
                error={errors[pageLinkField(link.id, "label")]}
              />
              <TextField
                name={pageLinkField(link.id, "href")}
                label={`Button ${index + 1} link`}
                required
                maxLength={2000}
                defaultValue={link.href}
                error={errors[pageLinkField(link.id, "href")]}
                hint="A site path like /research, an https:// link, or mailto:."
              />
            </div>
          ))}
        </fieldset>
      )}

      <FormFooter
        error={state.error}
        pending={pending}
        cancelHref="/admin/site"
      />
    </form>
  );
}
