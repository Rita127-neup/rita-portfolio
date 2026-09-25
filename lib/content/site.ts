// Reference copy of the content seeded into Supabase. The site reads this
// content from Supabase (see ./index.ts); keep this file until every public
// page has been verified, then it can be removed.

import type { ContactContent, HomeContent, SiteSettings } from "./types";

export const siteSettings: SiteSettings = {
  metaTitle: "Rita Neupane | Research & Computational Biology",
  metaDescription:
    "Rita Neupane's portfolio featuring research, computational biology, public health, data science, and independent projects.",
  brandMark: "RN",
  navigation: [
    { label: "About", href: "/about" },
    { label: "Research", href: "/research" },
    { label: "Projects", href: "/projects" },
    { label: "Publications", href: "/publications" },
    { label: "Contact", href: "/contact" },
  ],
  navCta: { label: "Let's connect", href: "/contact" },
  contactEmail: "neupanereeta8@gmail.com",
  phone: "+977 9761700496",
  birthday: "2007-08-24",
  location: "Siddharthanagar-09, Rupandehi",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/Rita127-neup" },
    { label: "LinkedIn" },
    { label: "Google Scholar" },
  ],
};

export const homeContent: HomeContent = {
  eyebrow: "Researcher · Computational Biology · Data",
  firstName: "Rita",
  lastName: "Neupane.",
  intro:
    "I investigate biological and public-health questions through computation, data, and research.",
  primaryCta: { label: "Explore my research", href: "/research" },
  secondaryCta: { label: "Get to know me", href: "/about" },
  photoAlt: "Rita Neupane",
  photoPlaceholderInitials: "RN",
  photoPlaceholderText: "Photograph coming soon",
};

export const contactContent: ContactContent = {
  eyebrow: "Contact",
  title: "Let's connect.",
  intro:
    "I'm interested in research, computational biology, public health, data, and opportunities to learn and collaborate.",
  emailCardTitle: "Get in touch",
  emailCardText:
    "For research discussions, collaborations, or academic opportunities, feel free to reach out.",
  emailButtonLabel: "Email me →",
  socialCardTitle: "Find me online",
};
