import { notFound } from "next/navigation";
import { isUuid } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../../../_components/admin-ui";
import {
  PublicationEditForm,
  type EditablePublication,
} from "./publication-edit-form";

export default async function EditPublication({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Authorize before touching any publication data.
  await requireAdmin();

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: publication, error } = await supabase
    .from("publications")
    .select(
      "id, category, title, byline, summary, tags, status, doi, published_on, sort_order, is_published, links:publication_links(id, label, url, variant, sort_order)",
    )
    .eq("id", id)
    .order("sort_order", { referencedTable: "publication_links" })
    .maybeSingle<EditablePublication>();

  if (error) throw new Error("Could not load publication.");
  if (!publication) notFound();

  return (
    <>
      <AdminNav />
      <AdminHeader
        eyebrow="Edit publication"
        title={publication.title}
        backHref="/admin/publications"
        backLabel="Back to publications"
      />
      <Panel>
        <PublicationEditForm publication={publication} />
      </Panel>
    </>
  );
}
