import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../_components/admin-ui";
import { OrganizationForm, OrganizationLogoUpload } from "./organization-form";
import { createOrganization, deleteOrganization, removeOrganizationLogo } from "./actions";

type OrganizationRow = {
  id: string;
  name: string;
  image_id: string | null;
  sort_order: number;
  is_visible: boolean;
};

export default async function AdminOrganizations() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("id, name, image_id, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Organizations"
        text="Manage the organizations shown on the home page, including their logos."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      <div className="mt-8">
        <Panel>
          <h2 className="text-lg font-semibold">Add organization</h2>
          <form action={createOrganization} className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <div>
              <label htmlFor="new-org-name" className="text-sm text-slate-300">Name</label>
              <input id="new-org-name" name="name" required maxLength={200} placeholder="e.g. National Innovation Center" className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white" />
            </div>
            <div>
              <label htmlFor="new-org-order" className="text-sm text-slate-300">Display order</label>
              <input id="new-org-order" name="sort_order" type="number" min="0" defaultValue={organizations?.length ?? 0} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white" />
            </div>
            <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f]">Add</button>
          </form>
        </Panel>
      </div>

      <div className="mt-8 space-y-5">
        {error ? (
          <Panel><p className="text-red-300">Could not load organizations: {error.message}</p></Panel>
        ) : (
          (organizations ?? []).map((organization) => (
            <Panel key={organization.id}>
              <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                <OrganizationForm organization={organization} />

                <div>
                  <h2 className="text-sm font-medium text-slate-300">Logo</h2>
                  <div className="mt-4 flex min-h-28 items-center justify-center rounded-2xl border border-white/10 bg-[#07111f] p-5">
                    {organization.image_id ? (
                      <Image
                        src={`/media/organization/${organization.id}?v=${organization.image_id}`}
                        alt={organization.name}
                        width={96}
                        height={96}
                        unoptimized
                        className="max-h-24 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm text-slate-500">No logo</span>
                    )}
                  </div>

                  <OrganizationLogoUpload
                    organizationId={organization.id}
                    hasLogo={Boolean(organization.image_id)}
                  />

                  <form action={deleteOrganization} className="mt-3">
                    <input type="hidden" name="id" value={organization.id} />
                    <button type="submit" className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300">
                      Delete organization
                    </button>
                  </form>

                  {organization.image_id && (
                    <form action={removeOrganizationLogo} className="mt-3">
                      <input type="hidden" name="id" value={organization.id} />
                      <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
                        Remove logo
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Panel>
          ))
        )}
      </div>
    </>
  );
}
