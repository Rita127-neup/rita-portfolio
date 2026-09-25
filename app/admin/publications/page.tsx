import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  AdminHeader,
  AdminNav,
  Badge,
  PublishedBadge,
  RecordList,
  SavedNotice,
} from "../_components/admin-ui";

type PublicationRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminPublications({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any publication data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("id, title, category, status, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const publications = (data ?? []) as PublicationRow[];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Publications"
        text="Publications shown on the public publications page, in display order."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <div className="mt-6"><a href="/admin/publications/new" className="inline-block rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f]">Add publication</a></div>
      <SavedNotice show={saved === "1"} text="Publication saved." />

      <RecordList
        error={!!error}
        errorText="Could not load publications. Please try again."
        emptyText="No publications found."
        rows={publications.map((publication) => ({
          id: publication.id,
          eyebrow: publication.category,
          title: publication.title,
          editHref: `/admin/publications/${publication.id}/edit`,
          badges: (
            <>
              <Badge>Order {publication.sort_order}</Badge>
              <Badge>{publication.status}</Badge>
              <PublishedBadge published={publication.is_published} />
            </>
          ),
        }))}
        deleteAction={deletePublication}
      />
    </>
  );
}
