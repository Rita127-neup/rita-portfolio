// Shared content types. These mirror the shape the future CMS/database records will take.

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; url?: string };
export type SiteSettings = {
  metaTitle: string; metaDescription: string; brandMark: string; navigation: NavItem[]; navCta: NavItem;
  contactEmail: string; phone: string; birthday: string; location: string; socialLinks: SocialLink[];
};
export type ProfileInfo = { email: string; phone: string; birthday: string; location: string };
export type Organization = { id: string; name: string; logoId: string | null; sortOrder: number };
export type LinkButton = { label: string; href: string };
export type HomeContent = {
  eyebrow: string; firstName: string; lastName: string; intro: string; primaryCta: LinkButton; secondaryCta: LinkButton;
  photoUrl?: string; photoAlt: string; cv?: LinkButton; photoPlaceholderInitials: string; photoPlaceholderText: string;
  /** How the name is said, shown under it, for example "REE-tah NYOW-pah-neh". */
  pronunciation?: string;
};
export type Testimonial = { id: string; name: string; role: string; quote: string; photoUrl?: string };
export type PageHeader = { eyebrow: string; title: string; titleMuted?: string; intro: string };
export type EducationItem = { school: string; detail: string; years: string };
export type AboutContent = PageHeader & { body: string; education: EducationItem[] };
export type ResearchItem = { id: string; category: string; title: string; summary: string; tags: string[] };
export type Project = {
  id: string; category: string; title: string; description: string; tags: string[];
  status: string; imageId: string | null; githubUrl?: string | null; linkUrl?: string | null;
};
export type PublicationLink = { label: string; url: string; variant: "primary" | "secondary" };
export type Publication = { id: string; category: string; title: string; byline: string; summary: string; tags: string[]; status: string; links: PublicationLink[] };
export type ContactContent = { eyebrow: string; title: string; intro: string; emailCardTitle: string; emailCardText: string; emailButtonLabel: string; socialCardTitle: string };

/** One line of the languages or hobbies list: a title and a few friendly words. */
export type NoteItem = { title: string; note: string };
/** Editable from /admin/about; each part falls back to the built-in text while it is empty. */
export type AboutExtras = {
  paragraphs: string[];
  languages: NoteItem[];
  hobbies: NoteItem[];
  /** Recording of how the name is said, when one has been uploaded. */
  pronunciationAudioUrl?: string;
  blogEnabled: boolean;
};
export type BlogPost = { id: string; slug: string; title: string; excerpt: string; body: string; publishedAt: string | null };
