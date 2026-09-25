// Shared content types. These mirror the shape the future CMS/database
// records will take, so pages don't need to change when the source does.

export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  /** Omit until a real URL is supplied; the UI shows "coming soon". */
  url?: string;
};

export type SiteSettings = {
  metaTitle: string;
  metaDescription: string;
  brandMark: string;
  navigation: NavItem[];
  navCta: NavItem;
  contactEmail: string;
  phone: string;
  birthday: string;
  location: string;
  socialLinks: SocialLink[];
};

export type LinkButton = {
  label: string;
  href: string;
};

export type HomeContent = {
  eyebrow: string;
  firstName: string;
  lastName: string;
  intro: string;
  primaryCta: LinkButton;
  secondaryCta: LinkButton;
  /** Omit until a photo is supplied; the UI shows the initials placeholder. */
  photoUrl?: string;
  photoAlt: string;
  /** Omit until a CV is uploaded; the UI hides the download button. */
  cv?: LinkButton;
  photoPlaceholderInitials: string;
  photoPlaceholderText: string;
};

export type PageHeader = {
  eyebrow: string;
  title: string;
  /** Optional second line of the title, rendered in muted slate. */
  titleMuted?: string;
  intro: string;
};

export type AboutContent = PageHeader & { body: string };

export type ResearchItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
};

export type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
};

export type PublicationLink = {
  label: string;
  url: string;
  variant: "primary" | "secondary";
};

export type Publication = {
  id: string;
  category: string;
  title: string;
  byline: string;
  summary: string;
  tags: string[];
  status: string;
  links: PublicationLink[];
};

export type ContactContent = {
  eyebrow: string;
  title: string;
  intro: string;
  emailCardTitle: string;
  emailCardText: string;
  emailButtonLabel: string;
  socialCardTitle: string;
};
