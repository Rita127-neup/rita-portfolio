import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav } from "./_components/admin-ui";

type Section = {
  title: string;
  text: string;
  href?: string;
  /** Table whose rows are counted for the summary line. */
  table?: string;
  /** Column that marks a row as live on the public site. */
  liveColumn?: "is_published" | "is_visible";
  unavailable?: string;
};

const sections: Section[] = [
  {
    title: "Projects",
    text: "Edit, reorder, and publish or hide projects.",
    href: "/admin/projects",
    table: "projects",
    liveColumn: "is_published",
  },
  {
    title: "Publications",
    text: "Edit publications, their links, order, and visibility.",
    href: "/admin/publications",
    table: "publications",
    liveColumn: "is_published",
  },
  {
    title: "Research",
    text: "Edit research items, order, and visibility.",
    href: "/admin/research",
    table: "research_items",
    liveColumn: "is_published",
  },
  {
    title: "Experiences",
    text: "Edit experience entries. Not shown on a public page yet.",
    href: "/admin/experiences",
    table: "experiences",
    liveColumn: "is_published",
  },
  {
    title: "Achievements",
    text: "Edit achievements. Not shown on a public page yet.",
    href: "/admin/achievements",
    table: "achievements",
    liveColumn: "is_published",
  },
  {
    title: "Site & pages",
    text: "Page text, contact email, social links, and site title.",
    href: "/admin/site",
    table: "pages",
  },
  {
    title: "CV",
    text: "Upload, replace, or remove the CV visitors can download.",
    href: "/admin/cv",
  },
  {
    title: "Organizations",
    text: "Manage organizations, logos, order, and visibility.",
    href: "/admin/organizations",
    table: "organizations",
    liveColumn: "is_visible",
  },
  {
    title: "Photo",
    text: "Upload, replace, or remove the home page photo.",
    href: "/admin/photo",
  },
];

async function getSummary(section: Section): Promise<string | null> {
  if (!section.table) return null;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(section.table)
    .select(section.liveColumn ?? "id");
  if (error || !data) return "Could not load summary.";

  const total = data.length;
  const noun = total === 1 ? "record" : "records";
  if (section.title === "Site & pages")
    return `${total} ${total === 1 ? "page" : "pages"}`;
  if (!section.liveColumn) return `${total} ${noun}`;

  const live = (data as unknown as Record<string, boolean>[]).filter(
    (row) => row[section.liveColumn!],
  ).length;
  return `${total} ${noun} · ${live} published`;
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  const summaries = await Promise.all(sections.map(getSummary));

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Dashboard"
        text={`Signed in as ${admin.email ?? "admin"}`}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="rounded-3xl border border-white/10 bg-[#0c1a2d] p-8"
          >
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-slate-400">{section.text}</p>
            {summaries[index] && (
              <p className="mt-3 text-sm text-slate-500">{summaries[index]}</p>
            )}
            {section.href ? (
              <Link
                href={section.href}
                className="mt-6 inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
              >
                Manage {section.title.toLowerCase()} →
              </Link>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                {section.unavailable}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
