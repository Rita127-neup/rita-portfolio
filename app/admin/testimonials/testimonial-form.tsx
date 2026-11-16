"use client";

import { useRef, useState, useTransition } from "react";
import { registerTestimonialPhoto, updateTestimonial } from "./actions";
import { createClient } from "@/lib/supabase/client";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  sort_order: number;
  is_visible: boolean;
};

const input =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60";

export function TestimonialForm({ testimonial }: { testimonial: Testimonial }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateTestimonial(form);
      setMessage(result.error ?? "Saved.");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300" htmlFor={`name-${testimonial.id}`}>Name</label>
          <input id={`name-${testimonial.id}`} name="name" required maxLength={200} defaultValue={testimonial.name} className={input} />
        </div>
        <div>
          <label className="text-sm text-slate-300" htmlFor={`role-${testimonial.id}`}>Role or title</label>
          <input id={`role-${testimonial.id}`} name="role" maxLength={200} defaultValue={testimonial.role} placeholder="e.g. Founder, LSDT" className={input} />
        </div>
      </div>
      <div>
        <label className="text-sm text-slate-300" htmlFor={`quote-${testimonial.id}`}>
          Their words (paste the paragraph or letter exactly as they sent it)
        </label>
        <textarea id={`quote-${testimonial.id}`} name="quote" rows={9} maxLength={8000} defaultValue={testimonial.quote} className={`${input} leading-7`} />
        <p className="mt-2 text-xs text-slate-500">
          Leave this empty and the entry stays hidden on the site. A line break starts a new paragraph. Long text is folded behind a &ldquo;Read the full note&rdquo; button.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300" htmlFor={`order-${testimonial.id}`}>Display order</label>
          <input id={`order-${testimonial.id}`} name="sort_order" type="number" min={0} max={9999} defaultValue={testimonial.sort_order} className={input} />
        </div>
        <label className="flex items-center gap-3 self-end pb-3 text-slate-300">
          <input type="checkbox" name="is_visible" defaultChecked={testimonial.is_visible} className="h-5 w-5 accent-cyan-400" /> Visible on site
        </label>
      </div>
      {message && <p className="text-sm text-slate-400">{message}</p>}
      <input type="hidden" name="id" value={testimonial.id} />
      <button type="submit" disabled={pending} className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f] disabled:opacity-60">
        {pending ? "Saving..." : "Save testimonial"}
      </button>
    </form>
  );
}

export function TestimonialPhotoUpload({ testimonialId, hasPhoto }: { testimonialId: string; hasPhoto: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return setError("Choose a photo.");
    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : null;
    if (!ext) return setError("Use JPEG, PNG, or WebP.");
    if (file.size > 3 * 1024 * 1024) return setError("Keep the photo under 3 MB.");
    setError(null);
    startTransition(async () => {
      const path = `photos/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await createClient().storage
        .from("portfolio-files")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return setError("The photo could not be uploaded.");
      const form = new FormData();
      form.set("id", testimonialId);
      form.set("path", path);
      const result = await registerTestimonialPhoto(form);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
        className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-cyan-300"
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={pending} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400/40 disabled:opacity-60">
        {pending ? "Uploading..." : hasPhoto ? "Replace photo" : "Upload photo"}
      </button>
    </form>
  );
}
