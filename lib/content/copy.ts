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
  /** Replaces the stored source-code link, for a project whose main repository is not the stored one. */
  sourceUrl?: string;
};

export const pageCopy = {
  about: { title: "About" },
  research: {
    title: "Research",
    intro: "Studies in antimicrobial resistance, public health and algorithmic fairness, and what each one found.",
  },
  publications: {
    title: "Publications",
    intro: "Where each study stands today. A preprint or a repository record is not a peer-reviewed paper, and the status says which it is.",
  },
  gallery: { title: "Photo journal", intro: "A few moments along the way." },
  projects: {
    title: "Things I've built",
    intro: "Tools that make public data in Nepal easier to use. My research studies are on the Research page.",
  },
};

export const aboutCopy = {
  paragraphs: [
    "I'm an independent researcher in Kathmandu. My main project asks one question: when a model that predicts antibiotic resistance from bacterial genomes is used on isolates from another country, can you still trust the probabilities it gives?",
    "I finished the Science stream in 2025 and taught myself Python, statistics and epidemiology. I don't have a lab, so my work runs on public data and Google Colab, and the code is on GitHub for anyone to rerun.",
    "Reliable data has been the hardest part of this work. It made me curious about how governments publish data at all, and that curiosity is behind my projects.",
    "Alongside research, I volunteer with LSDT, a registered NGO that runs free weekly sessions in Nepal. I co-founded its youth cohort; what that involved is under Projects.",
    "Next I want to study biology, computer science and statistics together at a US college.",
  ],
};

/** The beyond-research part of the home page. */
export const aboutExtras = {
  languages: [
    { name: "Nepali", level: "native" },
    { name: "English", level: "" },
    { name: "Hindi", level: "" },
    { name: "Japanese", level: "a little" },
  ],
  hobbies: [
    "Makeup",
    "Doing hairstyles",
    "Sewing",
    "Watching Friends",
    "Planting flowers",
    "Writing a diary",
    "Researching random things on my laptop",
  ],
};

/** Status shown in the publication list, keyed by the slug of the row in `publications`. */
export const publicationStatus: Record<string, string> = {
  "genomic-amr-ciprofloxacin-calibration": "Preprint posted 19 October 2026 · transferred to Access Microbiology (Microbiology Society) for review",
  "dengue-fever-nepal": "Under peer review at Discover Public Health · open-access record on Zenodo",
  "caffeine-consumption-siddharthanagar": "Open-access record on Zenodo",
  "group-fairness-recourse-fairness": "Preprint on Preprints.org · not peer reviewed",
};

/** Keyed by the slug of the row in `publications`. */
export const researchCopy: Record<string, EntryCopy> = {
  "genomic-amr-ciprofloxacin-calibration": {
    kicker: "Antimicrobial resistance",
    byline: "First author, with co-authors",
    paragraphs: [
      "Genomic models of antibiotic resistance are usually judged on how well they separate resistant from susceptible isolates. Whether their probabilities stay trustworthy in a different population is not routinely checked. I trained an elastic-net logistic regression on 2,574 UK isolates of E. coli, then tested it on 3,153 from Norway and 238 from South Asia, all taken from the public BV-BRC database.",
      "Its ranking held up in all three populations (AUROC 0.968 to 0.992). Its probabilities were less reliable: in Norway the model became overconfident, and South Asia's sample is too small to say either way, so the paper reports that result as inconclusive. The study also tests how much local data recalibration needs. Two errors in the analysis pipeline were found and fixed before submission.",
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
      "My part: conceiving the study, the literature review, interpreting the findings and leading the manuscript. Co-authors built the data-extraction pipelines, curated the time series and ran the correlation models.",
    extraLinks: [{ label: "Code", url: "https://github.com/Aryan-infinite/google-trends-dengue-nepal" }],
  },
  "caffeine-consumption-siddharthanagar": {
    kicker: "Public health",
    title: "Caffeine Consumption Patterns, Awareness, and Self-Reported Health Effects Among Adults in Nepal",
    byline: "First author, with one co-author",
    status: "Open-access record on Zenodo",
    paragraphs: [
      "The studies of caffeine use that I could find were mostly from other countries, so I surveyed adults in my own community with a 27-item bilingual questionnaire. Of 218 responses, 204 had usable data. Tea (chiya) was the most common source (78.4%), and 71.1% drank caffeine every day.",
      "The analysis used chi-square tests. The sample comes from one town, Siddharthanagar-09 in Bhairahawa, so the study describes patterns there rather than Nepal as a whole.",
    ],
    contribution:
      "My part: study design, questionnaire, analysis and the manuscript, written with my co-author.",
  },
  "group-fairness-recourse-fairness": {
    kicker: "Algorithmic fairness",
    byline: "Third author, with two co-authors",
    paragraphs: [
      "Methods that make a machine-learning model fairer are usually judged by whether they give different groups equal outcomes. This preprint asks something different: when a model denies someone, is the distance they would have to move to be approved the same for every group? Two standard methods, Reweighing and a covariance-penalized logistic regression, were tested on two public datasets, the Adult income data (audited by sex) and the COMPAS criminal-justice data (audited by race), over 30 random train/test splits.",
      "On the Adult data both methods reached near-identical fairness scores, yet denied women and denied men sat at different distances from approval, and the difference held among the same people denied by both models. On COMPAS the results are inconclusive. The paper is also clear about its limits: distance to a decision boundary does not prove that a person could actually make that change.",
    ],
    contribution:
      "My part, as the paper's author-contributions statement lists it: formal analysis, interpreting the results, the visualizations, and reviewing and editing the manuscript. My co-authors led the conceptualization, methodology, software and first draft, and handled validation and reproducibility checks.",
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
      "Dengue Lens Nepal is a public website that presents Nepal's national dengue surveillance data and calculates the statistics automatically, so people can follow dengue in Nepal without digging through source reports.",
      "The aim is to make dengue data understandable to the public, not only to people who already work with it.",
    ],
  },
  "nepal-education-data-engine": {
    role: "Contributor and ministry outreach",
    status: "Open source",
    // The repository's own README describes the tool, so the numbers below follow it.
    paragraphs: [
      "Every year Nepal's Centre for Education and Human Resource Development publishes its Flash Report, the headline school census, as a PDF of more than 60 pages. The numbers are public, but the tables are hard to extract, compare or reuse.",
      "This open-source project rebuilds the report's tables as machine-readable files and serves them in a public dashboard. The current version extracts 71 tables from the 2025/26 report, checks every extracted number against the PDF, and lists the places where the report disagrees with itself.",
      "The idea came out of the data-access problem I ran into on the dengue study. I took it to the Ministry of Science, Technology and Innovation in July 2026 and met Minister Mahabir Pun. His ministry had the same problem and was already working on it, and on his advice I visited the National Examination Board in October. I also proposed two legal reforms to the ministry, in writing and at a meeting, and proposed a hackathon.",
    ],
    contribution:
      "My part: the ministry and National Examination Board conversations (with teammates), the policy proposals and, in November, an extractor for the sector-plan indicators table plus a dashboard fix. Most of the extraction and dashboard code was written by teammates.",
    sourceUrl: "https://github.com/Bishalneupa/nepal-education-data-engine",
  },
  "neb-notes": {
    kicker: "Education technology",
    role: "Co-creator",
    status: "Live site",
    paragraphs: [
      "NEB Notes, which runs as NoteVault, is a free website where NEB +2 students share and read notes, cheatsheets and past papers, ask questions in a doubts section and keep notes of their own.",
      "More than 610 students use it. What students share is checked by a moderator before it goes up.",
    ],
  },
  "lsdt-youth": {
    kicker: "Community & education",
    role: "Co-founder and former president",
    status: "Ongoing",
    paragraphs: [
      "LSDT (Leadership Skills and Development Training) is a registered NGO that runs free weekly sessions in Nepal, about three hours each week. Each session hosts a guest, such as a government official, a business leader or a professional from any field, who talks with the children and adults who attend about what they have learned in their work. LSDT Youth is the cohort for young people, which I co-founded.",
      "I hosted many of the sessions, attended meetings with the guests, and taught sessions on CRISPR, first aid and mental health. I also ran quizzes, debates and competitions for the children. I stepped down as president when I moved to Kathmandu and still help in an administrative role.",
    ],
  },
  "lsdt-website": {
    kicker: "Web development",
    role: "Builder",
    status: "Built for LSDT",
    paragraphs: [
      "The website for LSDT and its youth cohort, with pages for the team, events, a photo gallery and a contact and join form.",
      "Team members sign in to edit the text, events and photos themselves, so the site does not depend on one person.",
    ],
  },
};
