/**
 * Hand-written copy for the public pages.
 *
 * Titles, links, tags, status and the order of each list still come from the
 * database (the admin dashboard). The longer write-ups live here, keyed by the
 * same slug, so every piece of work is described in exactly one place. An entry
 * with no copy here falls back to the summary stored in the database.
 *
 * Facts in this file should match the paper, the repository or the page they
 * describe. If a number changes there, change it here too.
 */

export type EntryCopy = {
  /** Shown above the title. Replaces the stored category. */
  kicker?: string;
  /** Replaces the stored title. */
  title?: string;
  /** Authorship line under the title. Replaces the stored byline. */
  byline?: string;
  /** Replaces the stored status. */
  status?: string;
  /** Role line, for projects. */
  role?: string;
  paragraphs: string[];
  /** One plain sentence on what the author did and what co-authors did. */
  contribution?: string;
  /** Links added to the ones stored in the database. */
  extraLinks?: { label: string; url: string }[];
};

export const pageCopy = {
  about: { title: "About" },
  research: {
    title: "Research",
    intro:
      "Studies in antimicrobial resistance and public health, with their current status and where to read them.",
  },
  projects: {
    title: "Things I've built",
    intro:
      "Open tools that make public data in Nepal easier to use. My research studies are on the Research page.",
  },
};

export const aboutCopy = {
  /** The first paragraph is set larger, as the lead. */
  paragraphs: [
    "I'm an independent researcher in Kathmandu. My main project asks one question: when a model that predicts antibiotic resistance from bacterial genomes is used on isolates from another country, can you still trust the probabilities it gives?",
    "I finished the Science stream in 2025 and taught myself Python, statistics and epidemiology. I don't have a lab, so my work runs on public data and Google Colab, and the code is on GitHub for anyone to rerun.",
    "Reliable data has been the hardest part of this work. It made me curious about how governments publish data at all, and that curiosity is behind my projects.",
    "Alongside research, I volunteer with LSDT, a registered NGO that runs free weekly sessions in Nepal, about three hours a week. Each session welcomes a guest, such as a government official, a business leader or a professional from any field, who shares their experience with the children and adults who attend. I co-founded LSDT's youth cohort, hosted many of the sessions and attended meetings with the guests. I also taught sessions on CRISPR, first aid and mental health, and on other scientific topics many participants had never heard of, and ran quizzes, debates and competitions for the children.",
    "Next I want to study biology, computer science and statistics together at a US college. The part of modelling I most want to get better at is the unglamorous part: finding the data, cleaning it, and testing it in places it wasn't built for.",
  ],
};

/** Keyed by the slug of the row in `publications`. */
export const researchCopy: Record<string, EntryCopy> = {
  "genomic-amr-ciprofloxacin-calibration": {
    kicker: "Antimicrobial resistance",
    byline: "First and corresponding author, with co-authors",
    paragraphs: [
      "Genomic models of antibiotic resistance are usually judged on how well they separate resistant from susceptible isolates. Whether their probabilities stay trustworthy in a different population is not routinely checked. I trained an elastic-net logistic regression on 2,574 UK isolates of E. coli, then tested it on 3,153 from Norway and 238 from South Asia, all taken from the public BV-BRC database.",
      "Its ranking held up everywhere (AUROC 0.968 to 0.992). Its probabilities did not: in Norway the model became overconfident. South Asia's sample is too small to settle the question either way, and the paper reports it as inconclusive. The study also tests how much local data recalibration needs, and documents two errors in the analysis pipeline that were found and fixed before submission.",
    ],
    contribution:
      "My part: study design, modelling and the manuscript. Co-authors handled data engineering and validation code.",
  },
  "dengue-fever-nepal": {
    kicker: "Epidemiology",
    title: "Google Trends search activity and laboratory-confirmed dengue cases in Nepal, 2019–2024",
    byline: "First author, with co-authors",
    paragraphs: [
      "Nepal's dengue figures exist in several conflicting versions. I phoned the Epidemiology and Disease Control Division, filed a formal letter and received six verified national datasets covering 2019 to 2024 (161,892 confirmed cases). The study then asks whether Google search interest can serve as a low-cost early signal of dengue activity.",
      "Monthly interest in “dengue fever” moved closely with reported cases (Pearson r = 0.78). A one-month lead was weaker (r ≈ 0.56 for “fever”). Media-driven search spikes and uneven internet access limit what search data can show, so the paper treats it as a complement to official surveillance, not a replacement.",
    ],
    contribution:
      "My part: study design, interpretation and the manuscript. Co-authors built the data-extraction pipelines and ran the correlation models.",
    extraLinks: [{ label: "Code", url: "https://github.com/Rita127-neup/google-trends-dengue-nepal" }],
  },
  "caffeine-consumption-siddharthanagar": {
    kicker: "Public health",
    title: "Caffeine Consumption Patterns, Awareness, and Self-Reported Health Effects Among Adults in Nepal",
    byline: "First author, with one co-author",
    status: "Open-access record on Zenodo",
    paragraphs: [
      "Most of the caffeine research I could find came from other countries, so I surveyed adults in my own community with a 27-item bilingual questionnaire. Of 218 responses, 204 had usable data. Tea, our everyday chiya, was the most common source (78.4%), and 71.1% drank caffeine every day.",
      "The analysis used chi-square tests. The sample comes from one town, Siddharthanagar-09 in Bhairahawa, so the study describes patterns there rather than Nepal as a whole.",
    ],
    contribution:
      "My part: study design, questionnaire, analysis and the manuscript, written with my co-author.",
  },
};

/**
 * Rows of `projects` that are research studies. They are described on the
 * Research page, so the Projects page leaves them out.
 */
export const researchProjectSlugs = ["ecoli-amr", "dengue-ewars", "dengue-fever-nepal", "caffeine-consumption"];

/** Keyed by the slug of the row in `projects`. */
export const projectCopy: Record<string, EntryCopy> = {
  "dengue-lens-nepal": {
    role: "Co-founder",
    status: "Live site",
    paragraphs: [
      "Nepal's dengue figures are spread across reports that do not always agree. Dengue Lens Nepal is a public site that brings the national surveillance numbers together in one place and calculates the statistics automatically, so anyone can follow the situation without digging through the source documents.",
      "The aim is to make dengue data understandable to the public, not only to people who already work with it.",
    ],
  },
  "nepal-education-data-engine": {
    role: "Initiator, researcher and developer, with a three-person team",
    status: "Open source",
    paragraphs: [
      "Nepal's school statistics are published as PDF flash reports. The figures are public, but they are hard to extract, compare across years or reuse. The project grew out of a conversation in July 2026 with Mahabir Pun, Minister for Science, Technology and Innovation. His ministry had the same data problem I had run into and was already working on it, and on his advice I visited the National Examination Board in October.",
      "We then built the pipeline ourselves: a Python tool that extracts the tables from the flash-report PDFs, standardizes them into machine-readable datasets, and feeds a public dashboard of enrollment, gender parity and teacher-student ratios. The code is open source.",
      "Alongside the code, I proposed two legal reforms to the ministry, in writing and at a meeting, and proposed a hackathon.",
    ],
  },
};
