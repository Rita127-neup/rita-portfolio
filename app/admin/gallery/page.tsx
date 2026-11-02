import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { ConfirmRemoveButton } from "../_components/upload-form";
import { GalleryUploadForm } from "./gallery-upload-form";
import { removeGalleryPhoto } from "./actions";

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
        text="Add extra photos to the homepage. Visitors can select the thumbnails beneath your main photo to switch between them."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SavedNotice show={params.saved === "1"} text="Photos added to the gallery." />
      <SavedNotice show={params.removed === "1"} text="Photo removed." />
      {params.error === "remove" && (
        <p role="alert" className="mt-6 text-sm text-red-300">
          Could not remove that photo. Please try again.
        </p>
      )}

      <Panel>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Add extra photos</h2>
            <p className="mt-2 text-sm text-slate-400">
              Add up to five at once. You can keep adding more later.
            </p>
          </div>
          <p className="text-sm text-slate-500">{photos.length} in gallery</p>
        </div>
        <GalleryUploadForm />
      </Panel>

      <Panel>
        <h2 className="text-2xl font-semibold">Gallery photos ({photos.length})</h2>
        {error ? (
          <p role="alert" className="mt-4 text-red-300">
            Could not load gallery photos.
          </p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-slate-400">
            No additional photos yet. Choose up to five above to get started.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((photo) => (
              <div key={photo.id} className="min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-[#07111f]">
                  <Image
                    src={"/media/gallery/" + photo.id}
                    alt={photo.media?.alt_text ?? ""}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                  {photo.media?.alt_text || "No description"}
                </p>
                <form
                  action={removeGalleryPhoto.bind(null, photo.id)}
                  className="mt-3"
                >
                  <ConfirmRemoveButton
                    label="Remove"
                    confirmText="Remove this photo from the home page gallery?"
                  />
                </form>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
