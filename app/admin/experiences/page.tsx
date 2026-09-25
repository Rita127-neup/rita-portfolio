import { deleteExperience } from "./actions";
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

type ExperienceRow = {
  id: string;
  role: string;
  organization: string;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminExperiences({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any experience data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("id, role, organization, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const experiences = (data ?? []) as ExperienceRow[];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Experiences"
        text="Experience entries, in display order. They are not shown on a public page yet."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <div className="mt-6"><a href="/admin/experiences/new" className="inline-block rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#07111f]">Add experience</a></div>
      <SavedNotice show={saved === "1"} text="Experience saved." />

      <RecordList
        error={!!error}
        errorText="Could not load experiences. Please try again."
        emptyText="No experiences have been added yet. Adding new entries is not available in this version."
        rows={experiences.map((experience) => ({
          id: experience.id,
          eyebrow: experience.organization,
          title: experience.role,
          editHref: `/admin/experiences/${experience.id}/edit`,
          badges: (
            <>
              <Badge>Order {experience.sort_order}</Badge>
              <PublishedBadge published={experience.is_published} />
            </>
          ),
        }))}
        deleteAction={deleteExperience}
      />
    </>
  );
}
