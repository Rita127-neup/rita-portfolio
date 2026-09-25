import { notFound } from "next/navigation";
import { isUuid } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../../../_components/admin-ui";
import {
  AchievementEditForm,
  type EditableAchievement,
} from "./achievement-edit-form";

export default async function EditAchievement({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Authorize before touching any achievement data.
  await requireAdmin();

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const supabase = await createClient();
  const { data: achievement, error } = await supabase
    .from("achievements")
    .select(
      "id, title, issuer, awarded_on, date_label, description, url, sort_order, is_published",
    )
    .eq("id", id)
    .maybeSingle<EditableAchievement>();

  if (error) throw new Error("Could not load achievement.");
  if (!achievement) notFound();

  return (
    <>
      <AdminNav />
      <AdminHeader
        eyebrow="Edit achievement"
        title={achievement.title}
        backHref="/admin/achievements"
        backLabel="Back to achievements"
      />
      <Panel>
        <AchievementEditForm achievement={achievement} />
      </Panel>
    </>
  );
}
