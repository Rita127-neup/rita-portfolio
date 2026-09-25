import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { OrganizationForm, OrganizationLogoUpload } from "./organization-form";
import { createOrganization, deleteOrganization, removeOrganizationLogo } from "./actions";

type OrganizationRow = {
  id: string;
  name: string;
  image_id: string | null;
  sort_order: number;
  is_visible: boolean;
};

export default async function AdminOrganizations({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const { saved, error: actionError } = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, image_id, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  const organizations = (data ?? []) as OrganizationRow[];
  const imageIds = organizations
    .map((organization) => organization.image_id)
    .filter((id): id is string => Boolean(id));

  const { data: mediaRows } = imageIds.length
    ? await supabase.from("media_assets").select("id, alt_text").in("id", imageIds)
    : { data: [] as { id: string; alt_text: string | null }[] };

  const mediaById = new Map((mediaRows ?? []).map((media) => [media.id, media]));

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Organizations"
        text="Manage the organizations shown on the home page, including their logos."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      <SavedNotice show={saved === "1"} text="Organization saved." />

      {actionError && (
        <p role="alert" className="mt-8 text-sm text-red-300">
          The organization could not be updated. Please try again.
        </p>
      )}

      <div className="mt-8">
        <Panel>
          <h2 className="text-lg font-semibold">Add organization</h2>
          <form action={createOrganization} className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <div>
              <label className="text-sm text-slate-300" htmlFor="new-org-name">Organization name</label>
              <input id="new-org-name" name="name" required maxLength={200} placeholder="e.g. National Innovation Center" className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60" />
            </div>
            <div>
              <label className="text-sm text-slate-300" htmlFor="new-org-order">Display order</label>
              <input id="new-org-order" name="sort_order" type="number" min={0} max={9999} defaultValue={organizations.length} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white outline-none focus:border-cyan-400/60" />
            </div>
            <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f]">Add organization</button>
          </form>
        </Panel>
      </div>

      <div className="mt-10 space-y-6">
        {error ? (
          <Panel><p className="text-red-300">Could not load organizations.</p></Panel>
        ) : organizations.map((organization) => {
          const image = organization.image_id ? mediaById.get(organization.image_id) ?? null : null;
          return (
            <Panel key={organization.id}>
              <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                <OrganizationForm organization={organization} />
                <div>
                  <h3 className="text-sm font-medium text-slate-300">Logo</h3>
                  <div className="mt-4 flex min-h-28 items-center justify-center rounded-2xl border border-white/10 bg-[#07111f] p-5">
                    {image ? (
                      <Image src={"/media/organization/" + organization.id + "?v=" + image.id} alt={image.alt_text ?? organization.name} width={96} height={96} unoptimized className="max-h-24 w-auto object-contain" />
                    ) : <span className="text-sm text-slate-500">No logo</span>}
                  </div>
                  <OrganizationLogoUpload organizationId={organization.id} hasLogo={!!image} />
                  <form action={deleteOrganization} className="mt-3" onSubmit={(event) => {
                    if (!confirm("Delete " + organization.name + "?")) event.preventDefault();
                  }}>
                    <input type="hidden" name="id" value={organization.id} />
                    <button type="submit" className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-300 hover:border-red-400/50 hover:text-red-200">Delete organization</button>
                  </form>
                  {image && (
                    <form action={removeOrganizationLogo} className="mt-3">
                      <input type="hidden" name="id" value={organization.id} />
                      <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400 hover:border-red-400/40 hover:text-red-200">Remove logo</button>
                    </form>
                  )}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
