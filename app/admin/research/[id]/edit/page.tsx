import { notFound } from "next/navigation";
import { isUuid } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../../../_components/admin-ui";
import { ResearchEditForm, type EditableResearch } from "./research-edit-form";

export default async function EditResearchItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Authorize before touching any research data.
  await requireAdmin();

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("research_items")
    .select("id, category, title, summary, tags, sort_order, is_published")
    .eq("id", id)
    .maybeSingle<EditableResearch>();

  if (error) throw new Error("Could not load research item.");
  if (!item) notFound();

  return (
    <>
      <AdminNav />
      <AdminHeader
        eyebrow="Edit research"
        title={item.title}
        backHref="/admin/research"
        backLabel="Back to research"
      />
      <Panel>
        <ResearchEditForm item={item} />
      </Panel>
    </>
  );
}
