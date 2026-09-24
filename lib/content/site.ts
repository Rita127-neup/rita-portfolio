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
