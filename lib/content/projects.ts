import type { PageHeader, Project } from "./types";

export const projectsPage: PageHeader = {
  eyebrow: "Projects",
  title: "Things I've built,",
  titleMuted: "studied, and explored.",
  intro:
    "A collection of my research, computational projects, and data-driven work across biology, public health, and machine learning.",
};

// Display order is array order; the "01", "02" labels are derived from it.
export const projects: Project[] = [
  {
    id: "ecoli-amr",
    category: "COMPUTATIONAL BIOLOGY",
    title: "E. coli Antimicrobial Resistance",
    description:
      "A machine-learning study of genomic prediction for ciprofloxacin resistance in E. coli, focusing on geographic generalization, model calibration, and population shift.",
    tags: ["AMR", "Machine Learning", "Genomics", "Python"],
    status: "Research",
  },
  {
    id: "dengue-lens-nepal",
    category: "PUBLIC HEALTH",
    title: "Dengue Lens Nepal",
    description:
      "A public-data project exploring dengue surveillance in Nepal through data analysis, visualization, and accessible public-health information.",
    tags: ["Dengue", "Public Health", "Data", "Nepal"],
    status: "Independent Project",
  },
  {
    id: "dengue-fever-nepal",
    category: "EPIDEMIOLOGY",
    title: "Dengue Fever in Nepal",
    description:
      "An analysis of national dengue surveillance data from 2019–2024, investigating temporal patterns and relationships between dengue cases and environmental variables.",
    tags: ["Epidemiology", "Statistics", "Public Health"],
    status: "Research",
  },
  {
    id: "caffeine-consumption",
    category: "HEALTH DATA",
    title: "Caffeine Consumption Study",
    description:
      "A community-based study examining caffeine consumption patterns, sources, motivations, and related behaviors among adults in Siddharthanagar, Nepal.",
    tags: ["Survey Research", "Statistics", "Public Health"],
    status: "Published Research",
  },
  {
    id: "health-prediction-models",
    category: "MACHINE LEARNING",
    title: "Health Prediction Models",
    description:
      "Machine-learning projects exploring symptom-based disease prediction and mental-health prediction using structured health data.",
    tags: ["Machine Learning", "Python", "Health Data"],
    status: "Independent Project",
  },
];
