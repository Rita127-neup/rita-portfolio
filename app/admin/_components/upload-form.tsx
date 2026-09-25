"use client";

// Uploads a file straight from the browser to the private Storage bucket
// with the admin's session (Storage RLS allows admins only), then asks a
// Server Function to verify it and link it to the site. Going direct avoids
// sending large files through the Next.js server.

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/storage";
import { inputClass, TextField } from "./fields";

type UploadFormProps = {
  folder: "cv" | "photos";
  /** Allowed MIME type -> file extension used in the stored path. */
  types: Record<string, string>;
  maxBytes: number;
  fileLabel: string;
  fileHint: string;
  textField: {
    name: string;
    label: string;
    defaultValue: string;
    maxLength: number;
    hint?: string;
  };
  submitLabel: string;
  register: (path: string, text: string) => Promise<{ error: string }>;
};

export function UploadForm({
  folder,
  types,
  maxBytes,
  fileLabel,
  fileHint,
  textField,
  submitLabel,
  register,
}: UploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const text = String(form.get(textField.name) ?? "").trim();

    if (!(file instanceof File) || file.size === 0)
      return setError("Choose a file to upload.");
    const extension = types[file.type];
    if (!extension) return setError("This file type is not allowed.");
    if (file.size > maxBytes)
      return setError(
        `Keep the file under ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      );
    if (!text) return setError(`${textField.label} is required.`);

    setError(null);
    startTransition(async () => {
      const path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await createClient()
        .storage.from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError("The file could not be uploaded. Please try again.");
        return;
      }

      // Redirects on success; returns an error message otherwise.
      const result = await register(path, text);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="file" className="text-sm text-slate-300">
          {fileLabel}
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept={Object.keys(types).join(",")}
          aria-describedby="file-hint"
          className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-sm file:text-cyan-300`}
        />
        <p id="file-hint" className="mt-2 text-sm text-slate-500">
          {fileHint}
        </p>
      </div>

      <TextField required {...textField} />

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] transition disabled:opacity-60"
      >
        {pending ? "Uploading..." : submitLabel}
      </button>
    </form>
  );
}

/** Submit button for a remove form that asks for confirmation first. */
export function ConfirmRemoveButton({
  label,
  confirmText,
}: {
  label: string;
  confirmText: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
      className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:border-red-400/40 hover:text-red-200"
    >
      {label}
    </button>
  );
}
