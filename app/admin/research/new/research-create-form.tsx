"use client";
import { useActionState } from "react";
import { initialFormState } from "@/lib/admin/form";
import { Checkbox, FormFooter, TextArea, TextField } from "../../_components/fields";
import { createResearchItem } from "../actions";
import type { ResearchFormValues } from "../validation";
export function ResearchCreateForm(){const [state,formAction,pending]=useActionState(createResearchItem,initialFormState<ResearchFormValues>());const v=state.values??{category:"",title:"",summary:"",tags:"",sort_order:"0",is_published:true};const e=state.fieldErrors;return <form action={formAction} className="space-y-6"><TextField name="title" label="Title" required maxLength={300} defaultValue={v.title} error={e.title}/><TextField name="category" label="Category" required maxLength={100} defaultValue={v.category} error={e.category}/><TextArea name="summary" label="Summary" required maxLength={5000} defaultValue={v.summary} error={e.summary}/><TextField name="tags" label="Tags" defaultValue={v.tags} error={e.tags} hint="Separate tags with commas."/><TextField name="sort_order" label="Display order" type="number" required defaultValue={v.sort_order} error={e.sort_order}/><Checkbox name="is_published" label="Published" defaultChecked={v.is_published}/><FormFooter error={state.error} pending={pending} cancelHref="/admin/research"/></form>;}
