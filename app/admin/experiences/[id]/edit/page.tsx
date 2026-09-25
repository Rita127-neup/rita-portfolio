import { notFound } from "next/navigation";
import { isUuid } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../../../_components/admin-ui";
import {
  ExperienceEditForm,
  type EditableExperience,
} from "./experience-edit-form";

export default async function EditExperience({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Authorize before touching any experience data.
  await requireAdmin();

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: experience, error } = await supabase
    .from("experiences")
    .select(
      "id, role, organization, location, start_date, end_date, is_current, date_label, description, url, tags, sort_order, is_published",
    )
    .eq("id", id)
    .maybeSingle<EditableExperience>();

  if (error) throw new Error("Could not load experience.");
  if (!experience) notFound();

  return (
    <>
      <AdminNav />
      <AdminHeader
        eyebrow="Edit experience"
        title={experience.role}
        backHref="/admin/experiences"
        backLabel="Back to experiences"
      />
      <Panel>
        <ExperienceEditForm experience={experience} />
      </Panel>
    </>
  );
}
