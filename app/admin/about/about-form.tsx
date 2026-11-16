"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerPronunciationAudio, removePronunciationAudio, saveAbout } from "./actions";

const input =
  "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60";

export function AboutForm({
  paragraphs,
  languages,
  hobbies,
  pronunciation,
}: {
  paragraphs: string;
  languages: string;
  hobbies: string;
  pronunciation: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await saveAbout(form);
      setMessage(result.error ?? "Saved. The home page is updated.");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div>
        <label htmlFor="about_paragraphs" className="text-sm text-slate-300">My biography</label>
        <textarea id="about_paragraphs" name="about_paragraphs" rows={14} maxLength={6000} defaultValue={paragraphs} className={`${input} leading-7`} />
        <p className="mt-2 text-xs text-slate-500">Leave a blank line between paragraphs. Empty = the built-in biography is shown.</p>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <div>
          <label htmlFor="languages" className="text-sm text-slate-300">Languages</label>
          <textarea id="languages" name="languages" rows={8} maxLength={1500} defaultValue={languages} className={`${input} leading-7`} />
          <p className="mt-2 text-xs text-slate-500">One per line: <code className="text-slate-300">Name | a few friendly words</code>. The words after | are optional.</p>
        </div>
        <div>
          <label htmlFor="hobbies" className="text-sm text-slate-300">Hobbies</label>
          <textarea id="hobbies" name="hobbies" rows={8} maxLength={3000} defaultValue={hobbies} className={`${input} leading-7`} />
          <p className="mt-2 text-xs text-slate-500">Same format, one per line.</p>
        </div>
      </div>

      <div className="max-w-sm">
        <label htmlFor="pronunciation" className="text-sm text-slate-300">How my name is said (written out)</label>
        <input id="pronunciation" name="pronunciation" maxLength={80} defaultValue={pronunciation} className={input} placeholder="REE-tah NYOW-pah-neh" />
        <p className="mt-2 text-xs text-slate-500">Shown under my name. The voice note below sits next to it.</p>
      </div>

      {message && <p role="status" className="text-sm text-cyan-200">{message}</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] disabled:opacity-60">
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

const TYPE_BY_EXTENSION: Record<string, string> = {
  mp3: "audio/mpeg",
  m4a: "audio/x-m4a",
  aac: "audio/aac",
  wav: "audio/wav",
  ogg: "audio/ogg",
  webm: "audio/webm",
};
const EXTENSION_BY_TYPE: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

export function VoiceUpload({ hasAudio }: { hasAudio: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return setError("Choose a recording.");
    const nameExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const type = EXTENSION_BY_TYPE[file.type] ? file.type : (TYPE_BY_EXTENSION[nameExtension] ?? "");
    const extension = EXTENSION_BY_TYPE[type];
    if (!extension) return setError("Use an .m4a, .mp3, .wav, .ogg or .aac recording.");
    if (file.size > 5 * 1024 * 1024) return setError("Keep it under 5 MB. A few seconds is plenty.");
    setError(null);
    setDone(false);
    startTransition(async () => {
      const path = `audio/${crypto.randomUUID()}.${extension}`;
      // Storage takes the type from the file itself, so give it one even if the browser left it blank.
      const typed = new File([file], file.name, { type });
      const { error: uploadError } = await createClient().storage
        .from("portfolio-files")
        .upload(path, typed, { contentType: type, upsert: false });
      if (uploadError) return setError("The recording could not be uploaded.");
      const result = await registerPronunciationAudio(path);
      if (result?.error) setError(result.error);
      else setDone(true);
    });
  }

  return (
    <div>
      <form onSubmit={submit} className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.m4a,.mp3,.wav,.ogg,.aac"
          required
          className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-cyan-300"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {done && <p role="status" className="text-sm text-cyan-200">Uploaded. A small play button now shows under your name.</p>}
        <button type="submit" disabled={pending} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400/40 disabled:opacity-60">
          {pending ? "Uploading..." : hasAudio ? "Replace recording" : "Upload recording"}
        </button>
      </form>
      {hasAudio && (
        <form action={removePronunciationAudio} className="mt-3">
          <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
            Remove recording
          </button>
        </form>
      )}
    </div>
  );
}
