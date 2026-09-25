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

type AchievementRow = {
  id: string;
  title: string;
  issuer: string | null;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminAchievements({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any achievement data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, title, issuer, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const achievements = (data ?? []) as AchievementRow[];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Achievements"
        text="Achievement entries, in display order. They are not shown on a public page yet."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <div className="mt-6"><a href="/admin/achievements/new" className="inline-block rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f]">Add achievement</a></div>
      <SavedNotice show={saved === "1"} text="Achievement saved." />

      <RecordList
        error={!!error}
        errorText="Could not load achievements. Please try again."
        emptyText="No achievements have been added yet. Adding new entries is not available in this version."
        rows={achievements.map((achievement) => ({
          id: achievement.id,
          eyebrow: achievement.issuer ?? undefined,
          title: achievement.title,
          editHref: `/admin/achievements/${achievement.id}/edit`,
          badges: (
            <>
              <Badge>Order {achievement.sort_order}</Badge>
              <PublishedBadge published={achievement.is_published} />
            </>
          ),
        }))}
        deleteAction={deleteAchievement}
      />
    </>
  );
}
