import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PHOTO_EXTENSIONS, PHOTO_MAX_BYTES } from "@/lib/storage";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { ConfirmRemoveButton, UploadForm } from "../_components/upload-form";
import { registerPhoto, removePhoto } from "./actions";

type HeroSectionRow = {
  image: { id: string; alt_text: string | null } | null;
};

export default async function AdminPhoto({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; removed?: string; error?: string }>;
}) {
  // Authorize before touching any photo data.
  await requireAdmin();

  const { saved, removed, error: actionError } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("image:media_assets(id, alt_text), page:pages!inner(slug)")
    .eq("section_key", "hero_photo")
    .eq("page.slug", "home")
    .maybeSingle<HeroSectionRow>();

  const image = data?.image ?? null;

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Photo"
        text="The photo in the home page hero. Without one, the initials placeholder is shown."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SavedNotice show={saved === "1"} text="Photo uploaded." />
      <SavedNotice show={removed === "1"} text="Photo removed from the site." />
      {actionError === "remove" && (
        <p role="alert" className="mt-8 text-sm text-red-300">
          The photo could not be removed. Please try again.
        </p>
      )}

      <Panel>
        <h2 className="text-2xl font-semibold">Current photo</h2>
        {error ? (
          <p role="alert" className="mt-4 text-red-300">
            Could not load the current photo. Please try again.
          </p>
        ) : image ? (
          <div className="mt-6 flex flex-wrap items-end gap-6">
            <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
              <Image
                src={`/media/hero-photo?v=${image.id}`}
                alt={image.alt_text ?? ""}
                fill
                unoptimized
                sizes="10rem"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              {image.alt_text && (
                <p className="text-sm text-slate-400">{image.alt_text}</p>
              )}
              <form action={removePhoto}>
                <ConfirmRemoveButton
                  label="Remove"
                  confirmText="Remove the photo from the home page? The file will be deleted."
                />
              </form>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-400">
            No photo uploaded. The home page shows the initials placeholder.
          </p>
        )}
      </Panel>

      <Panel>
        <h2 className="mb-6 text-2xl font-semibold">
          {image ? "Replace photo" : "Upload photo"}
        </h2>
        <UploadForm
          folder="photos"
          types={PHOTO_EXTENSIONS}
          maxBytes={PHOTO_MAX_BYTES}
          fileLabel="Image file"
          fileHint="JPEG, PNG or WebP, up to 5 MB. A portrait (4:5) crop fits best. Replacing deletes the previous file."
          textField={{
            name: "alt_text",
            label: "Description",
            defaultValue: image?.alt_text ?? "",
            maxLength: 200,
            hint: "Alt text for screen readers, e.g. who is in the photo.",
          }}
          submitLabel={image ? "Upload and replace" : "Upload"}
          register={registerPhoto}
        />
      </Panel>
    </>
  );
}
