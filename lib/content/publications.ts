import type { PageHeader, Publication } from "./types";

export const publicationsPage: PageHeader = {
  eyebrow: "Publications",
  title: "Research in",
  titleMuted: "the public record.",
  intro:
    "My published research has focused on public health, epidemiology, and data-driven investigation of health-related questions in Nepal.",
};

export const publicationsProfile = {
  heading: "Research profile",
  text: "Alongside these publications, I am currently developing a computational antimicrobial-resistance study using genomic data and machine learning.",
};

// Display order is array order; the "01", "02" labels are derived from it.
export const publications: Publication[] = [
  {
    id: "caffeine-consumption-siddharthanagar",
    category: "Public Health",
    title:
      "Caffeine Consumption Patterns Among Adults in Siddharthanagar-09, Bhairahawa, Nepal",
    byline: "First author · Community-based survey research",
    summary:
      "A community-based study examining caffeine consumption patterns, sources, motivations, and related behaviors among adults in Siddharthanagar-09, Bhairahawa.",
    tags: ["Survey Research", "Public Health", "Data Analysis", "Nepal"],
    status: "Published",
    links: [
      {
        label: "View research record →",
        url: "https://doi.org/10.5281/zenodo.21785947",
        variant: "primary",
      },
    ],
  },
  {
    id: "dengue-fever-nepal",
    category: "Epidemiology",
    title:
      "Dengue Fever in Nepal: Temporal Patterns and Environmental Associations",
    byline: "First author · National surveillance data analysis",
    summary:
      "An analysis of national dengue surveillance data from Nepal covering 2019–2024, investigating temporal patterns and relationships between dengue cases and environmental variables.",
    tags: ["Epidemiology", "Dengue", "Surveillance Data", "Nepal"],
    status: "Published",
    links: [
      {
        label: "View research record →",
        url: "https://doi.org/10.5281/zenodo.21773367",
        variant: "primary",
      },
      {
        label: "Dataset / repository →",
        url: "https://doi.org/10.5281/zenodo.21773367",
        variant: "secondary",
      },
    ],
  },
];
