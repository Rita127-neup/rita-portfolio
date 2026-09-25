"use client";

import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import { Checkbox, FormFooter, TextField } from "../_components/fields";
import { updateSocialLinks } from "./actions";
import { socialField, type SocialLinkValues } from "./validation";

export function SocialLinksForm({ links }: { links: SocialLinkValues[] }) {
  const [state, formAction, pending] = useActionState(
    updateSocialLinks,
    initialFormState<SocialLinkValues[]>(),
  );

  // After a failed save, show what was submitted rather than the saved values.
  const values = state.values ?? links;
  const errors = state.fieldErrors;

  if (values.length === 0)
    return <p className="text-slate-400">No social links found.</p>;

  return (
    <form action={formAction} className="space-y-6">
      {values.map((link) => (
        <div
          key={link.id}
          className="space-y-4 border-t border-white/10 pt-6 first:border-t-0 first:pt-0"
        >
          <input type="hidden" name="social_id" value={link.id} />
          <div className="grid gap-4 md:grid-cols-[1fr_2fr_8rem]">
            <TextField
              name={socialField(link.id, "label")}
              label="Label"
              required
              maxLength={50}
              defaultValue={link.label}
              error={errors[socialField(link.id, "label")]}
            />
            <TextField
              name={socialField(link.id, "url")}
              label="URL"
              type="url"
              placeholder="https:// (empty shows “coming soon”)"
              maxLength={2000}
              defaultValue={link.url}
              error={errors[socialField(link.id, "url")]}
            />
            <TextField
              name={socialField(link.id, "sort_order")}
              label="Order"
              type="number"
              required
              defaultValue={link.sort_order}
              error={errors[socialField(link.id, "sort_order")]}
            />
          </div>
          <Checkbox
            name={socialField(link.id, "is_visible")}
            label="Visible on the contact page"
            defaultChecked={link.is_visible}
          />
        </div>
      ))}

      <FormFooter error={state.error} pending={pending} cancelHref="/admin" />
    </form>
  );
}
