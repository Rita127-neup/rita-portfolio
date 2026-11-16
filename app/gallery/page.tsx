import { HomeGalleryWall } from "@/app/_components/home-gallery-wall";
import { InnerShell } from "@/app/_components/inner-shell";
import { getHomeGallery } from "@/lib/content";
import { pageCopy } from "@/lib/content/copy";

export const metadata = { title: "Photo journal" };

export default async function Gallery() {
  const photos = await getHomeGallery();

  return (
    <InnerShell>
      <h1 className="editorial-title">{pageCopy.gallery.title}</h1>
      <div className="mt-4">
        <HomeGalleryWall photos={photos} standalone />
      </div>
    </InnerShell>
  );
}
