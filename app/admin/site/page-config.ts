// Which parts of each public page are editable, and what they are called in
// the editor. Mirrors what the page components actually render, so the
// editor never offers a field the public site ignores. Pages or sections not
// listed here cannot be edited.

export type SectionField = "heading" | "body" | "button_label";

export type PageConfig = {
  name: string;
  /** Public route to revalidate after a save. */
  path: string;
  titleLabel: string;
  /** Second title line: required, optional, or not rendered by the page. */
  muted: "required" | "optional" | null;
  mutedLabel?: string;
  sections: Record<
    string,
    { name: string; fields: Partial<Record<SectionField, string>> }
  >;
  /** Whether the page's call-to-action buttons are editable. */
  links: boolean;
};

export const PAGE_CONFIG: Record<string, PageConfig> = {
  home: {
    name: "Home",
    path: "/",
    titleLabel: "First name",
    muted: "required",
    mutedLabel: "Last name (shown in grey)",
    sections: {
      hero_photo: {
        name: "Photo placeholder",
        fields: { heading: "Initials", body: "Placeholder text" },
      },
    },
    links: true,
  },
  about: {
    name: "About",
    path: "/about",
    titleLabel: "Title",
    muted: null,
    sections: {
      about_body: {
        name: "About content",
        fields: { body: "About text" },
      },
      education: {
        name: "Education",
        fields: { body: "One entry per line: School | Program / credential | Years" },
      },
    },
    links: false,
  },
  research: {
    name: "Research",
    path: "/research",
    titleLabel: "Title",
    muted: null,
    sections: {},
    links: false,
  },
  projects: {
    name: "Projects",
    path: "/projects",
    titleLabel: "Title",
    muted: "optional",
    mutedLabel: "Second title line (shown in grey, optional)",
    sections: {},
    links: false,
  },
  publications: {
    name: "Publications",
    path: "/publications",
    titleLabel: "Title",
    muted: "optional",
    mutedLabel: "Second title line (shown in grey, optional)",
    sections: {
      research_profile: {
        name: "Research profile box",
        fields: { heading: "Heading", body: "Text" },
      },
    },
    links: false,
  },
  contact: {
    name: "Contact",
    path: "/contact",
    titleLabel: "Title",
    muted: null,
    sections: {
      email_card: {
        name: "Email card",
        fields: { heading: "Heading", body: "Text", button_label: "Button label" },
      },
      social_card: {
        name: "Social links card",
        fields: { heading: "Heading" },
      },
    },
    links: false,
  },
};

export const PAGE_ORDER = [
  "home",
  "about",
  "research",
  "projects",
  "publications",
  "contact",
];
