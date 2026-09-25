import { notFound } from "next/navigation";
import { isUuid } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  AdminHeader,
  AdminNav,
  Panel,
} from "../../../../_components/admin-ui";
import { PAGE_CONFIG } from "../../../page-config";
import { PageEditForm, type EditablePage } from "./page-edit-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Authorize before touching any page data.
  await requireAdmin();

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: page, error } = await supabase
    .from("pages")
    .select(
      "id, slug, eyebrow, title, title_muted, intro, sections:page_sections(id, section_key, heading, body, button_label, sort_order), links:page_links(id, label, href, sort_order)",
    )
    .eq("id", id)
    .order("sort_order", { referencedTable: "page_sections" })
    .order("sort_order", { referencedTable: "page_links" })
    .maybeSingle<EditablePage & { slug: string }>();

  if (error) throw new Error("Could not load page.");
  const config = page ? PAGE_CONFIG[page.slug] : undefined;
  if (!page || !config) notFound();

  return (
    <>
      <AdminNav />
      <AdminHeader
        eyebrow="Edit page"
        title={config.name}
        text={`Text shown on ${config.path}.`}
        backHref="/admin/site"
        backLabel="Back to site & pages"
      />
      <Panel>
        <PageEditForm
          page={{
            ...page,
            sections: page.sections.filter(
              (section) => section.section_key in config.sections,
            ),
            links: config.links ? page.links : [],
          }}
          config={config}
        />
      </Panel>
    </>
  );
}
