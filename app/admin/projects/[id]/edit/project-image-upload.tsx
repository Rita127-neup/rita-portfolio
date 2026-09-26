"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { registerProjectImage, removeProjectImage } from "../../actions";

export function ProjectImageUpload({ projectId, imageId }: { projectId: string; imageId: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return setError("Choose an image.");
    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : null;
    if (!ext) return setError("Use JPEG, PNG, or WebP.");
    if (file.size > 5 * 1024 * 1024) return setError("Keep the image under 5 MB.");
    setError(null);
    startTransition(async () => {
      const path = "projects/" + crypto.randomUUID() + "." + ext;
      const { error: uploadError } = await createClient().storage.from("portfolio-files").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return setError("The image could not be uploaded.");
      const form = new FormData();
      form.set("id", projectId);
      form.set("path", path);
      const result = await registerProjectImage(form);
      if (result.error) setError(result.error);
      else window.location.reload();
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
        {imageId ? <Image src={"/media/project/" + projectId + "?v=" + imageId} alt="Current project image" fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">No project image yet</div>}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" required className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-cyan-300" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={pending} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400/40 disabled:opacity-60">{pending ? "Uploading..." : imageId ? "Replace image" : "Upload project image"}</button>
      </form>
      {imageId && (
        <form action={removeProjectImage}>
          <input type="hidden" name="id" value={projectId} />
          <button type="submit" className="text-sm text-slate-500 hover:text-red-300">Remove image</button>
        </form>
      )}
    </div>
  );
}
