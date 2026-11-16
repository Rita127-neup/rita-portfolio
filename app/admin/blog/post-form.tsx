"use client";

import { useState, useTransition } from "react";
import { updatePost } from "./actions";

type Post = { id: string; title: string; slug: string; excerpt: string; body: string; is_published: boolean };

const input =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60";

export function PostForm({ post }: { post: Post }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updatePost(form);
      setMessage(result.error ?? "Saved.");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <input type="hidden" name="id" value={post.id} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`title-${post.id}`} className="text-sm text-slate-300">Title</label>
          <input id={`title-${post.id}`} name="title" required maxLength={200} defaultValue={post.title} className={input} />
        </div>
        <div>
          <label htmlFor={`slug-${post.id}`} className="text-sm text-slate-300">Web address (letters, numbers and dashes)</label>
          <input id={`slug-${post.id}`} name="slug" maxLength={120} defaultValue={post.slug} className={input} />
        </div>
      </div>
      <div>
        <label htmlFor={`excerpt-${post.id}`} className="text-sm text-slate-300">One-line summary (shown in the list)</label>
        <input id={`excerpt-${post.id}`} name="excerpt" maxLength={500} defaultValue={post.excerpt} className={input} />
      </div>
      <div>
        <label htmlFor={`body-${post.id}`} className="text-sm text-slate-300">Post</label>
        <textarea id={`body-${post.id}`} name="body" rows={14} maxLength={60000} defaultValue={post.body} className={`${input} leading-7`} />
        <p className="mt-2 text-xs text-slate-500">Leave a blank line between paragraphs. Start a line with ## to make a heading.</p>
      </div>
      <label className="flex items-center gap-3 text-slate-300">
        <input type="checkbox" name="is_published" defaultChecked={post.is_published} className="h-5 w-5 accent-cyan-400" />
        Published (visitors can read it once the blog is switched on)
      </label>
      {message && <p role="status" className="text-sm text-slate-400">{message}</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f] disabled:opacity-60">
        {pending ? "Saving..." : "Save post"}
      </button>
    </form>
  );
}
