"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/storage";
import { inputClass } from "../_components/fields";
import { registerGalleryPhotos } from "./actions";

type SelectedPhoto = { file: File; altText: string };

export function GalleryUploadForm() {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function selectFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length > 5) {
      setError("Choose up to five photos at a time.");
      setPhotos([]);
      return;
    }

    const invalid = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size <= 0 ||
        file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setError("Use JPEG, PNG or WebP images, each no larger than 5 MB.");
      setPhotos([]);
      return;
    }

    setError(null);
    setPhotos(files.map((file) => ({ file, altText: "" })));
  }

  function updateAltText(index: number, altText: string) {
    setPhotos((current) =>
      current.map((photo, i) => (i === index ? { ...photo, altText } : photo)),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (photos.length === 0) {
      setError("Choose at least one photo.");
      return;
    }
    if (photos.some((photo) => !photo.altText.trim())) {
      setError("Add a short description for every photo.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const uploadedPaths: string[] = [];

      try {
        for (const photo of photos) {
          const extension =
            photo.file.type === "image/jpeg"
              ? "jpg"
              : photo.file.type === "image/png"
                ? "png"
                : "webp";
          const path = "photos/" + crypto.randomUUID() + "." + extension;
          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(path, photo.file, {
              contentType: photo.file.type,
              upsert: false,
            });

          if (uploadError) {
            throw new Error("A photo could not be uploaded. Please try again.");
          }
          uploadedPaths.push(path);
        }

        const result = await registerGalleryPhotos(
          uploadedPaths.map((path, index) => ({
            path,
            altText: photos[index].altText.trim(),
          })),
        );

        if (result?.error) {
          await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
          setError(result.error);
        }
      } catch (cause) {
        if (uploadedPaths.length) {
          await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
        }
        setError(
          cause instanceof Error
            ? cause.message
            : "The photos could not be uploaded.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="gallery-files" className="text-sm text-slate-300">
          Choose photos
        </label>
        <input
          id="gallery-files"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => selectFiles(event.currentTarget.files)}
          className={inputClass + " file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:text-sm file:text-cyan-300"}
        />
        <p className="mt-2 text-sm text-slate-500">
          Select up to five photos per upload. You can repeat this as often as you like; there is no five-photo gallery limit. JPEG, PNG or WebP, up to 5 MB each.
        </p>
      </div>

      {photos.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-300">
            {photos.length} {photos.length === 1 ? "photo" : "photos"} selected
          </p>
          {photos.map((photo, index) => (
            <div
              key={photo.file.name + "-" + photo.file.lastModified + "-" + index}
              className="rounded-2xl border border-white/10 bg-[#07111f]/60 p-4"
            >
              <p className="truncate text-sm font-medium text-white">{photo.file.name}</p>
              <label
                htmlFor={"gallery-alt-" + index}
                className="mt-3 block text-xs text-slate-400"
              >
                Photo description (required)
              </label>
              <input
                id={"gallery-alt-" + index}
                value={photo.altText}
                onChange={(event) => updateAltText(index, event.target.value)}
                maxLength={200}
                required
                placeholder="Describe what this photo shows"
                className={inputClass + " mt-2"}
              />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || photos.length === 0}
        className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f] transition disabled:opacity-60"
      >
        {pending ? "Uploading photos..." : "Add " + (photos.length || "") + " photos to gallery"}
      </button>
    </form>
  );
}
