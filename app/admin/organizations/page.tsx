import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { OrganizationForm, OrganizationLogoUpload } from "./organization-form";
import { removeOrganizationLogo } from "./actions";

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
    .select("id, name, image_id, sort_order, is_visible, image:media_assets(id, alt_text)")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminNav />
      <AdminHeader title="Organizations" text="Manage the organizations shown on the home page, including their logos." backHref="/admin" backLabel="Back to dashboard" />
      <SavedNotice show={saved === "1"} text="Organization saved." />
      {actionError && <p role="alert" className="mt-8 text-sm text-red-300">The organization could not be updated. Please try again.</p>}
      <div className="mt-10 space-y-6">
        {error ? <Panel><p className="text-red-300">Could not load organizations.</p></Panel> : data?.map((organization) => (
          <Panel key={organization.id}>
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <OrganizationForm organization={organization} />
              <div>
                <h3 className="text-sm font-medium text-slate-300">Logo</h3>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-2xl border border-white/10 bg-[#07111f] p-5">
                  {organization.image ? (
                    <Image src={`/media/organization/${organization.id}?v=${organization.image.id}`} alt={organization.image.alt_text ?? organization.name} width={96} height={96} unoptimized className="max-h-24 w-auto object-contain" />
                  ) : <span className="text-sm text-slate-500">No logo</span>}
                </div>
                <OrganizationLogoUpload organizationId={organization.id} hasLogo={!!organization.image} />
                {organization.image && (
                  <form action={removeOrganizationLogo} className="mt-3">
                    <input type="hidden" name="id" value={organization.id} />
                    <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400 hover:border-red-400/40 hover:text-red-200">Remove logo</button>
                  </form>
                )}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
