"use client";
import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import { Checkbox, FormFooter, TextArea, TextField } from "../../_components/fields";
import { createPublication } from "../actions";
import type { PublicationFormValues } from "../validation";

export function PublicationCreateForm() {
  const [state, formAction, pending] = useActionState(createPublication, initialFormState<PublicationFormValues>());
  const values = state.values ?? { category:"", title:"", byline:"", summary:"", tags:"", status:"Draft", doi:"", published_on:"", sort_order:"0", is_published:true, links:[] };
  const e=state.fieldErrors;
  return <form action={formAction} className="space-y-6">
    <TextField name="title" label="Title" required maxLength={300} defaultValue={values.title} error={e.title}/>
    <div className="grid gap-6 md:grid-cols-2"><TextField name="category" label="Category" required maxLength={100} defaultValue={values.category} error={e.category}/><TextField name="status" label="Status" required maxLength={100} defaultValue={values.status} error={e.status}/></div>
    <TextField name="byline" label="Byline" maxLength={300} defaultValue={values.byline} error={e.byline}/>
    <TextArea name="summary" label="Summary" required maxLength={5000} defaultValue={values.summary} error={e.summary}/>
    <TextField name="tags" label="Tags" defaultValue={values.tags} error={e.tags} hint="Separate tags with commas."/>
    <div className="grid gap-6 md:grid-cols-3"><TextField name="doi" label="DOI (optional)" maxLength={210} defaultValue={values.doi} error={e.doi}/><TextField name="published_on" label="Publication date" type="date" defaultValue={values.published_on} error={e.published_on}/><TextField name="sort_order" label="Display order" type="number" required defaultValue={values.sort_order} error={e.sort_order}/></div>
    <Checkbox name="is_published" label="Published (visible on the public site)" defaultChecked={values.is_published}/>
    <FormFooter error={state.error} pending={pending} cancelHref="/admin/publications"/>
  </form>;
}
