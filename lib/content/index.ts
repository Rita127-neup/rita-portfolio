// Content access layer. Pages read content only through these functions, so
// they don't depend on where the content comes from.
//
// All content is read from Supabase with the public client (publishable key,
// no session). RLS returns published/visible rows only, even for a signed-in
// admin, and the queries filter on the same flags as a second check. A failed
// read throws instead of falling back to the local files in this folder, so a
// build fails rather than deploying stale content. Those files are kept only
// as a reference copy of the seeded content.

import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import type {
  AboutContent,
  ContactContent,
  HomeContent,
  PageHeader,
  Project,
  Publication,
  PublicationLink,
  ResearchItem,
  SiteSettings,
} from "./types";

export type * from "./types";

function fail(what: string, reason: string): never {
  throw new Error(`Could not load ${what} from Supabase: ${reason}`);
}

type SectionRow = {
  section_key: string;
  heading: string | null;
  body: string | null;
  button_label: string | null;
  is_visible: boolean;
  /** Only returned when the linked media row is public (RLS). */
  image: { id: string; object_path: string; alt_text: string | null } | null;
};

type PageLinkRow = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  is_visible: boolean;
};

type PageRow = {
  eyebrow: string;
  title: string;
  title_muted: string | null;
  intro: string;
  sections: SectionRow[];
  links: PageLinkRow[];
};

// Cached per render, so the layout and a page can share one request.
const getPage = cache(async (slug: string): Promise<PageRow> => {
  const { data, error } = await getPublicSupabaseClient()
    .from("pages")
    .select(
      "eyebrow, title, title_muted, intro, sections:page_sections(section_key, heading, body, button_label, is_visible, image:media_assets(id, object_path, alt_text)), links:page_links(label, href, variant, is_visible, sort_order)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .order("sort_order", { referencedTable: "page_links" })
    .maybeSingle<PageRow>();

  if (error) fail(`the ${slug} page`, error.message);
  if (!data) fail(`the ${slug} page`, "it is missing or unpublished.");

  return {
    ...data,
    sections: data.sections.filter((section) => section.is_visible),
    links: data.links.filter((link) => link.is_visible),
  };
});

function pageHeader(page: PageRow): PageHeader {
  return {
    eyebrow: page.eyebrow,
    title: page.title,
    titleMuted: page.title_muted ?? undefined,
    intro: page.intro,
  };
}

function pageSection(page: PageRow, key: string): SectionRow {
  const section = page.sections.find((s) => s.section_key === key);
  if (!section) fail(`the "${key}" page section`, "it is missing or hidden.");
  return section;
}

function pageLink(page: PageRow, variant: "primary" | "secondary") {
  const link = page.links.find((l) => l.variant === variant);
  if (!link) fail(`the ${variant} page button`, "it is missing or hidden.");
  return { label: link.label, href: link.href };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = getPublicSupabaseClient();
  const [settings, navigation, social] = await Promise.all([
    supabase
      .from("site_settings")
      .select(
        "meta_title, meta_description, brand_mark, nav_cta_label, nav_cta_href, contact_email",
      )
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("navigation_items")
      .select("label, href")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("social_links")
      .select("label, url")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (settings.error) fail("site settings", settings.error.message);
  if (!settings.data) fail("site settings", "the settings row is missing.");
  if (navigation.error) fail("navigation", navigation.error.message);
  if (social.error) fail("social links", social.error.message);

  const s = settings.data;
  return {
    metaTitle: s.meta_title,
    metaDescription: s.meta_description,
    brandMark: s.brand_mark,
    navigation: (navigation.data as { label: string; href: string }[]).map(
      (item) => ({ label: item.label, href: item.href }),
    ),
    navCta: { label: s.nav_cta_label, href: s.nav_cta_href },
    contactEmail: s.contact_email ?? "",
    socialLinks: (social.data as { label: string; url: string | null }[]).map(
      (link) => (link.url ? { label: link.label, url: link.url } : { label: link.label }),
    ),
  };
});

/**
 * The current published CV, or null if none is uploaded. The file itself is
 * served through /cv with a short-lived signed URL.
 */
export const getCurrentCv = cache(
  async (): Promise<{ title: string; objectPath: string } | null> => {
    const { data, error } = await getPublicSupabaseClient()
      .from("cv_documents")
      .select("title, media:media_assets(object_path)")
      .eq("is_current", true)
      .eq("is_published", true)
      .maybeSingle<{ title: string; media: { object_path: string } | null }>();

    if (error) fail("the CV", error.message);
    if (!data?.media) return null;
    return { title: data.title, objectPath: data.media.object_path };
  },
);

/** Storage path of the home page photo, or null if none is uploaded. */
export async function getHeroPhotoPath(): Promise<string | null> {
  const page = await getPage("home");
  return pageSection(page, "hero_photo").image?.object_path ?? null;
}

export async function getHomeContent(): Promise<HomeContent> {
  const [page, cv] = await Promise.all([getPage("home"), getCurrentCv()]);
  const photo = pageSection(page, "hero_photo");

  return {
    // The media id changes on every replacement, so browsers fetch the new
    // photo instead of a cached one.
    photoUrl: photo.image ? `/media/hero-photo?v=${photo.image.id}` : undefined,
    photoAlt:
      photo.image?.alt_text ??
      [page.title, page.title_muted].filter(Boolean).join(" "),
    cv: cv ? { label: `Download ${cv.title}`, href: "/cv" } : undefined,
    eyebrow: page.eyebrow,
    firstName: page.title,
    lastName: page.title_muted ?? "",
    intro: page.intro,
    primaryCta: pageLink(page, "primary"),
    secondaryCta: pageLink(page, "secondary"),
    photoPlaceholderInitials: photo.heading ?? "",
    photoPlaceholderText: photo.body ?? "",
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  return pageHeader(await getPage("about"));
}

export async function getResearchContent() {
  const [page, { data, error }] = await Promise.all([
    getPage("research"),
    getPublicSupabaseClient()
      .from("research_items")
      .select("slug, category, title, summary, tags")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (error) fail("research items", error.message);

  const items: ResearchItem[] = (
    data as {
      slug: string;
      category: string;
      title: string;
      summary: string;
      tags: string[] | null;
    }[]
  ).map((row) => ({
    id: row.slug,
    category: row.category,
    title: row.title,
    summary: row.summary,
    tags: row.tags ?? [],
  }));

  return { page: pageHeader(page), items };
}

// Published projects in display order.
export async function getProjectsContent() {
  const [page, { data, error }] = await Promise.all([
    getPage("projects"),
    getPublicSupabaseClient()
      .from("projects")
      .select("slug, category, title, description, tags, status")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (error) fail("projects", error.message);

  const items: Project[] = (
    data as {
      slug: string;
      category: string;
      title: string;
      description: string;
      tags: string[] | null;
      status: string;
    }[]
  ).map((row) => ({
    id: row.slug,
    category: row.category,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    status: row.status,
  }));

  return { page: pageHeader(page), items };
}

export async function getPublicationsContent() {
  const [page, { data, error }] = await Promise.all([
    getPage("publications"),
    getPublicSupabaseClient()
      .from("publications")
      .select(
        "slug, category, title, byline, summary, tags, status, links:publication_links(label, url, variant, sort_order)",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("sort_order", { referencedTable: "publication_links" }),
  ]);

  if (error) fail("publications", error.message);

  const profile = pageSection(page, "research_profile");

  const items: Publication[] = (
    data as {
      slug: string;
      category: string;
      title: string;
      byline: string;
      summary: string;
      tags: string[] | null;
      status: string;
      links: PublicationLink[];
    }[]
  ).map((row) => ({
    id: row.slug,
    category: row.category,
    title: row.title,
    byline: row.byline,
    summary: row.summary,
    tags: row.tags ?? [],
    status: row.status,
    links: row.links.map((link) => ({
      label: link.label,
      url: link.url,
      variant: link.variant,
    })),
  }));

  return {
    page: pageHeader(page),
    profile: { heading: profile.heading ?? "", text: profile.body ?? "" },
    items,
  };
}

export async function getContactContent(): Promise<ContactContent> {
  const page = await getPage("contact");
  const email = pageSection(page, "email_card");
  const social = pageSection(page, "social_card");

  return {
    eyebrow: page.eyebrow,
    title: page.title,
    intro: page.intro,
    emailCardTitle: email.heading ?? "",
    emailCardText: email.body ?? "",
    emailButtonLabel: email.button_label ?? "",
    socialCardTitle: social.heading ?? "",
  };
}

/** Formats a zero-based list position as a display label, e.g. 0 -> "01". */
export function displayNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
