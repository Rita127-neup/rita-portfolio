"use client";

import { useRef, useState, useTransition } from "react";
import { updateOrganization, registerOrganizationLogo } from "./actions";
import { createClient } from "@/lib/supabase/client";

type Organization = { id: string; name: string; sort_order: number; is_visible: boolean };

export function OrganizationForm({ organization }: { organization: Organization }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateOrganization(form);
      setMessage(result.error ?? "Saved.");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="text-sm text-slate-300" htmlFor={`name-${organization.id}`}>Name</label>
        <input id={`name-${organization.id}`} name="name" required maxLength={200} defaultValue={organization.name} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300" htmlFor={`order-${organization.id}`}>Display order</label>
          <input id={`order-${organization.id}`} name="sort_order" type="number" min={0} max={9999} defaultValue={organization.sort_order} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60" />
        </div>
        <label className="flex items-center gap-3 self-end pb-3 text-slate-300">
          <input type="checkbox" name="is_visible" defaultChecked={organization.is_visible} className="h-5 w-5 accent-cyan-400" /> Visible on site
        </label>
      </div>
      {message && <p className="text-sm text-slate-400">{message}</p>}
      <input type="hidden" name="id" value={organization.id} />
      <button type="submit" disabled={pending} className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f] disabled:opacity-60">{pending ? "Saving..." : "Save organization"}</button>
    </form>
  );
}

export function OrganizationLogoUpload({ organizationId, hasLogo }: { organizationId: string; hasLogo: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return setError("Choose a logo file.");
    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : null;
    if (!ext) return setError("Use JPEG, PNG, or WebP.");
    if (file.size > 2 * 1024 * 1024) return setError("Keep the logo under 2 MB.");
    setError(null);
    startTransition(async () => {
      const path = `logos/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await createClient().storage.from("portfolio-files").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return setError("The logo could not be uploaded.");
      const form = new FormData();
      form.set("id", organizationId);
      form.set("path", path);
      const result = await registerOrganizationLogo(form);
      if (result.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" required className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-cyan-300" />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={pending} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400/40 disabled:opacity-60">{pending ? "Uploading..." : hasLogo ? "Replace logo" : "Upload logo"}</button>
    </form>
  );
}
