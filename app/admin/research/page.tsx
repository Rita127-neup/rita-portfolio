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

type ResearchRow = {
  id: string;
  title: string;
  category: string;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminResearch({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any research data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research_items")
    .select("id, title, category, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as ResearchRow[];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Research"
        text="Research items shown on the public research page, in display order."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <div className="mt-6"><a href="/admin/research/new" className="inline-block rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f]">Add researc</a></div>
      <SavedNotice show={saved === "1"} text="Research item saved." />

      <RecordList
        error={!!error}
        errorText="Could not load research items. Please try again."
        emptyText="No research items found."
        rows={items.map((item) => ({
          id: item.id,
          eyebrow: item.category,
          title: item.title,
          editHref: `/admin/research/${item.id}/edit`,
          badges: (
            <>
              <Badge>Order {item.sort_order}</Badge>
              <PublishedBadge published={item.is_published} />
            </>
          ),
        }))}
        deleteAction={deleteResearchItem}
      />
    </>
  );
}
