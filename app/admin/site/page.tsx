import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  AdminHeader,
  AdminNav,
  Panel,
  SavedNotice,
} from "../_components/admin-ui";
import { PAGE_CONFIG, PAGE_ORDER } from "./page-config";
import { SiteSettingsForm } from "./site-settings-form";
import { SocialLinksForm } from "./social-links-form";

const savedText: Record<string, string> = {
  settings: "Site settings saved.",
  social: "Social links saved.",
  page: "Page saved.",
};

export default async function AdminSite({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any site data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const [settingsResult, socialResult, pagesResult] = await Promise.all([
    supabase
      .from("site_settings")
      .select(
        "brand_mark, meta_title, meta_description, contact_email, nav_cta_label, nav_cta_href",
      )
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("social_links")
      .select("id, label, url, sort_order, is_visible")
      .order("sort_order", { ascending: true }),
    supabase.from("pages").select("id, slug, title"),
  ]);

  const settings = settingsResult.data;
  const socialLinks = (socialResult.data ?? []) as {
    id: string;
    label: string;
    url: string | null;
    sort_order: number;
    is_visible: boolean;
  }[];
  const pages = ((pagesResult.data ?? []) as { id: string; slug: string }[])
    .filter((page) => page.slug in PAGE_CONFIG)
    .sort((a, b) => PAGE_ORDER.indexOf(a.slug) - PAGE_ORDER.indexOf(b.slug));

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Site & pages"
        text="Site-wide details, social links, and the text on each public page."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SavedNotice show={!!saved && saved in savedText} text={savedText[saved ?? ""]} />

      <h2 className="mt-16 text-2xl font-semibold">Pages</h2>
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a2d]">
        {pagesResult.error ? (
          <p role="alert" className="p-8 text-red-300">
            Could not load pages. Please try again.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {pages.map((page) => (
              <li
                key={page.id}
                className="flex flex-wrap items-center justify-between gap-4 p-6 md:px-8"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {PAGE_CONFIG[page.slug].name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {PAGE_CONFIG[page.slug].path}
                  </p>
                </div>
                <Link
                  href={`/admin/site/pages/${page.id}/edit`}
                  className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Edit text
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="mt-16 text-2xl font-semibold">Site settings</h2>
      <Panel>
        {settings ? (
          <SiteSettingsForm
            settings={{
              brand_mark: settings.brand_mark,
              meta_title: settings.meta_title,
              meta_description: settings.meta_description,
              contact_email: settings.contact_email ?? "",
              nav_cta_label: settings.nav_cta_label,
              nav_cta_href: settings.nav_cta_href,
            }}
          />
        ) : (
          <p role="alert" className="text-red-300">
            Could not load site settings. Please try again.
          </p>
        )}
      </Panel>

      <h2 className="mt-16 text-2xl font-semibold">Social links</h2>
      <p className="mt-2 text-slate-400">
        Shown on the contact page. Leave a URL empty to show “coming soon”.
      </p>
      <Panel>
        {socialResult.error ? (
          <p role="alert" className="text-red-300">
            Could not load social links. Please try again.
          </p>
        ) : (
          <SocialLinksForm
            links={socialLinks.map((link) => ({
              id: link.id,
              label: link.label,
              url: link.url ?? "",
              sort_order: String(link.sort_order),
              is_visible: link.is_visible,
            }))}
          />
        )}
      </Panel>
    </>
  );
}
