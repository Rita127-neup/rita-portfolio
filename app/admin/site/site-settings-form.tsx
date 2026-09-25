"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import { FormFooter, TextArea, TextField } from "../_components/fields";
import { updateSiteSettings } from "./actions";
import type { SiteSettingsFormValues } from "./validation";

export function SiteSettingsForm({
  settings,
}: {
  settings: SiteSettingsFormValues;
}) {
  const [state, formAction, pending] = useActionState(
    updateSiteSettings,
    initialFormState<SiteSettingsFormValues>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values = state.values ?? settings;
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="brand_mark"
          label="Brand mark"
          required
          maxLength={20}
          defaultValue={values.brand_mark}
          error={errors.brand_mark}
          hint="Shown at the top left of every page."
        />
        <TextField
          name="contact_email"
          label="Contact email"
          type="email"
          required
          maxLength={320}
          defaultValue={values.contact_email}
          error={errors.contact_email}
          hint="Used by the Email me button on the contact page."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TextField name="phone" label="Phone" required maxLength={30} defaultValue={values.phone} error={errors.phone} />
        <TextField name="birthday" label="Birthday" type="date" required defaultValue={values.birthday} error={errors.birthday} />
        <TextField name="location" label="Location" required maxLength={150} defaultValue={values.location} error={errors.location} />
      </div>

      <TextField
        name="meta_title"
        label="Browser tab title"
        required
        maxLength={200}
        defaultValue={values.meta_title}
        error={errors.meta_title}
      />
      <TextArea
        name="meta_description"
        label="Search engine description"
        required
        rows={3}
        maxLength={500}
        defaultValue={values.meta_description}
        error={errors.meta_description}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="nav_cta_label"
          label="Navigation button label"
          required
          maxLength={50}
          defaultValue={values.nav_cta_label}
          error={errors.nav_cta_label}
        />
        <TextField
          name="nav_cta_href"
          label="Navigation button link"
          required
          maxLength={2000}
          defaultValue={values.nav_cta_href}
          error={errors.nav_cta_href}
          hint="A site path like /contact, an https:// link, or mailto:."
        />
      </div>

      <FormFooter error={state.error} pending={pending} cancelHref="/admin" />
    </form>
  );
}
