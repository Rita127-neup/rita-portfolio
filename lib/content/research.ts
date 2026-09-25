// Reference copy of the content seeded into Supabase. The site reads this
// content from Supabase (see ./index.ts); keep this file until every public
// page has been verified, then it can be removed.

import type { PageHeader, ResearchItem } from "./types";

export const researchPage: PageHeader = {
  eyebrow: "Research",
  title: "Research",
  intro:
    "My research uses computation, biological data, and statistical analysis to investigate questions in antimicrobial resistance and public health.",
};

// Display order is array order; the "01", "02" labels are derived from it.
export const researchItems: ResearchItem[] = [
  {
    id: "ecoli-amr-generalization",
    category: "AMR / MACHINE LEARNING",
    title:
      "Geographic generalization and calibration of E. coli resistance prediction",
    summary:
      "A computational study of genomic prediction for ciprofloxacin resistance in E. coli, examining how model discrimination and calibration change across geographic populations.",
    tags: ["Antimicrobial resistance", "Machine learning", "Genomics"],
  },
  {
    id: "dengue-nepal",
    category: "PUBLIC HEALTH",
    title: "Dengue Fever in Nepal",
    summary:
      "Analysis of national dengue surveillance data from Nepal to investigate temporal patterns and relationships between dengue cases and environmental variables.",
    tags: ["Epidemiology", "Public health", "Nepal"],
  },
];
