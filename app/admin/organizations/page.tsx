import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../_components/admin-ui";
import { createOrganization, deleteOrganization, updateOrganization } from "./actions";

export default async function AdminOrganizations() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: organizations, error } = await supabase
    .from("organizations")
    .select("id, name, sort_order, is_visible")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Organizations"
        text="Manage the organizations shown on the home page."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      <div className="mt-8">
        <Panel>
          <h2 className="text-lg font-semibold">Add organization</h2>
          <form action={createOrganization} className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <div>
              <label htmlFor="new-org-name" className="text-sm text-slate-300">Name</label>
              <input id="new-org-name" name="name" required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white" />
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
              <form action={updateOrganization} className="grid gap-4 lg:grid-cols-[1fr_150px_auto_auto] lg:items-end">
                <input type="hidden" name="id" value={organization.id} />
                <div>
                  <label htmlFor={`name-${organization.id}`} className="text-sm text-slate-300">Name</label>
                  <input id={`name-${organization.id}`} name="name" defaultValue={organization.name} required className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white" />
                </div>
                <div>
                  <label htmlFor={`order-${organization.id}`} className="text-sm text-slate-300">Order</label>
                  <input id={`order-${organization.id}`} name="sort_order" type="number" min="0" defaultValue={organization.sort_order} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white" />
                </div>
                <label className="flex items-center gap-2 pb-3 text-sm text-slate-300">
                  <input type="checkbox" name="is_visible" defaultChecked={organization.is_visible} />
                  Visible
                </label>
                <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f]">Save</button>
              </form>
              <form action={deleteOrganization} className="mt-3">
                <input type="hidden" name="id" value={organization.id} />
                <button type="submit" className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300">Delete organization</button>
              </form>
            </Panel>
          ))
        )}
      </div>
    </>
  );
}
