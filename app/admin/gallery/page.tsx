import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PHOTO_EXTENSIONS, PHOTO_MAX_BYTES } from "@/lib/storage";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { ConfirmRemoveButton, UploadForm } from "../_components/upload-form";
import { registerGalleryPhoto, removeGalleryPhoto } from "./actions";

type GalleryRow = {
  id: string;
  media: { id: string; alt_text: string | null } | null;
};

export default async function AdminGallery({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; removed?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_gallery_images")
    .select("id, media:media_assets(id, alt_text)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<GalleryRow[]>();
  const photos = data ?? [];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Home photo gallery"
        text="Upload extra photos for the homepage. Visitors can click the thumbnails below your main photo to switch between them."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SavedNotice show={params.saved === "1"} text="Photo added to the gallery." />
      <SavedNotice show={params.removed === "1"} text="Photo removed." />
      {params.error === "remove" && <p role="alert" className="mt-6 text-sm text-red-300">Could not remove that photo. Please try again.</p>}

      <Panel>
        <h2 className="text-2xl font-semibold">Gallery photos ({photos.length})</h2>
        {error ? (
          <p role="alert" className="mt-4 text-red-300">Could not load gallery photos.</p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-slate-400">No additional photos yet. Upload some below.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#07111f]">
                  <Image src={`/media/gallery/${photo.id}`} alt={photo.media?.alt_text ?? ""} fill unoptimized sizes="12rem" className="object-cover" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-400">{photo.media?.alt_text}</p>
                <form action={removeGalleryPhoto.bind(null, photo.id)} className="mt-3">
                  <ConfirmRemoveButton label="Remove" confirmText="Remove this photo from the home page gallery?" />
                </form>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <h2 className="mb-2 text-2xl font-semibold">Add a photo</h2>
        <p className="mb-6 text-sm text-slate-400">JPEG, PNG or WebP, up to 5 MB. Portrait photos work best.</p>
        <UploadForm
          folder="photos"
          types={PHOTO_EXTENSIONS}
          maxBytes={PHOTO_MAX_BYTES}
          fileLabel="Image file"
          fileHint="Choose a photo to add. This will not replace your main photo."
          textField={{ name: "alt_text", label: "Description", defaultValue: "", maxLength: 200, hint: "A short description for screen readers." }}
          submitLabel="Add to gallery"
          register={registerGalleryPhoto}
        />
      </Panel>
    </>
  );
}
