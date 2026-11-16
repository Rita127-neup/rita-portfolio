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
  /** Label of the button. */
  action?: string;
};

type Group = { heading: string; blurb: string; sections: Section[] };

// Grouped by what you are trying to do, with plain names.
const groups: Group[] = [
  {
    heading: "My home page",
    blurb: "What visitors see first.",
    sections: [
      {
        title: "About me",
        text: "Biography, languages, hobbies, and the voice note for your name.",
        href: "/admin/about",
        action: "Edit about me",
      },
      {
        title: "Testimonials",
        text: "What people wrote about you, with their photo. Empty ones show a soft placeholder.",
        href: "/admin/testimonials",
        table: "testimonials",
        liveColumn: "is_visible",
        action: "Edit testimonials",
      },
      {
        title: "Photo",
        text: "Your picture next to your name.",
        href: "/admin/photo",
        action: "Change photo",
      },
      {
        title: "Photo gallery",
        text: "The scattered photo journal page.",
        href: "/admin/gallery",
        action: "Edit gallery",
      },
      {
        title: "Organizations",
        text: "Logos at the bottom of the home page.",
        href: "/admin/organizations",
        table: "organizations",
        liveColumn: "is_visible",
        action: "Edit organizations",
      },
      {
        title: "CV",
        text: "The PDF visitors download.",
        href: "/admin/cv",
        action: "Change CV",
      },
    ],
  },
  {
    heading: "My work",
    blurb: "Research, papers and projects.",
    sections: [
      {
        title: "Publications",
        text: "Each paper, where it stands, and its links.",
        href: "/admin/publications",
        table: "publications",
        liveColumn: "is_published",
        action: "Edit publications",
      },
      {
        title: "Research",
        text: "The research write-ups.",
        href: "/admin/research",
        table: "research_items",
        liveColumn: "is_published",
        action: "Edit research",
      },
      {
        title: "Projects",
        text: "Things you have built, in order.",
        href: "/admin/projects",
        table: "projects",
        liveColumn: "is_published",
        action: "Edit projects",
      },
    ],
  },
  {
    heading: "Links, contact and later",
    blurb: "Social links, site text, and things that are ready but not public yet.",
    sections: [
      {
        title: "Social links (ORCID, GitHub...)",
        text: "Add your ORCID link here whenever you have it; it appears on the home page as soon as it is filled in.",
        href: "/admin/site",
        action: "Edit links",
      },
      {
        title: "Blog",
        text: "Write posts any time. The blog stays hidden from visitors until you switch it on.",
        href: "/admin/blog",
        table: "blog_posts",
        liveColumn: "is_published",
        action: "Open blog",
      },
      {
        title: "Site & pages",
        text: "Contact email, location, site title and page text.",
        href: "/admin/site",
        table: "pages",
        action: "Edit site text",
      },
      {
        title: "Experiences",
        text: "Not shown on a public page yet.",
        href: "/admin/experiences",
        table: "experiences",
        liveColumn: "is_published",
        action: "Edit experiences",
      },
      {
        title: "Achievements",
        text: "Not shown on a public page yet.",
        href: "/admin/achievements",
        table: "achievements",
        liveColumn: "is_published",
        action: "Edit achievements",
      },
    ],
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

  const flat = groups.flatMap((group) => group.sections);
  const summaries = new Map<Section, string | null>(
    await Promise.all(flat.map(async (section) => [section, await getSummary(section)] as const)),
  );

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Dashboard"
        text={`Signed in as ${admin.email ?? "admin"}. Pick what you want to change; every page here saves straight to the website.`}
      />

      <div className="mt-12 space-y-14">
        {groups.map((group) => (
          <section key={group.heading}>
            <h2 className="text-2xl font-semibold">{group.heading}</h2>
            <p className="mt-1 text-slate-400">{group.blurb}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.sections.map((section) => (
                <Link
                  key={section.title}
                  href={section.href ?? "/admin"}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#0c1a2d] p-6 transition hover:border-cyan-400/40"
                >
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{section.text}</p>
                  {summaries.get(section) && (
                    <p className="mt-3 text-xs text-slate-500">{summaries.get(section)}</p>
                  )}
                  <span className="mt-4 text-sm text-cyan-300 transition group-hover:text-cyan-200">
                    {section.action ?? "Open"} →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
