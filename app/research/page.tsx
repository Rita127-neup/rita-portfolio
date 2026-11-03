import { getProjectsContent, getPublicationsContent, getResearchContent, displayNumber } from "@/lib/content";
import { WorkMark } from "@/app/_components/work-mark";

const studyDetails: Record<string, { material: string; method: string; question: string; publicationId?: string }> = {
  "ecoli-amr-generalization": {
    material: "7,274 quality-controlled E. coli genomes",
    method: "Genomic resistance prediction, external population validation, and post-hoc calibration",
    question: "Does a model trained in one population produce reliable resistance probabilities in another?",
    publicationId: "genomic-amr-ciprofloxacin-calibration",
  },
  "dengue-ewars": {
    material: "Google Trends search activity and Nepal dengue surveillance records",
    method: "Public-data audit and time-series comparison of search activity with confirmed cases",
    question: "Can online search activity provide an earlier signal of dengue activity in Nepal?",
  },
  "dengue-nepal": {
    material: "161,892 nationally reported dengue cases, 2019–2024",
    method: "Retrospective analysis of surveillance records and environmental variables",
    question: "How did dengue incidence vary over time, and how did those patterns relate to environmental conditions?",
    publicationId: "dengue-fever-nepal",
  },
  "caffeine-consumption-patterns-among-adults-in-siddharthanagar-09-bhairahawa-nepal": {
    material: "204 adults in Siddharthanagar-09, Bhairahawa",
    method: "Community-based survey using a 27-item bilingual questionnaire",
    question: "What were the main patterns, sources, motivations, and knowledge surrounding caffeine consumption?",
    publicationId: "caffeine-consumption-siddharthanagar",
  },
};

export default async function Research() {
  const [{ page, items }, { items: publications }, { items: projects }] = await Promise.all([
    getResearchContent(),
    getPublicationsContent(),
    getProjectsContent(),
  ]);

  const researchInitiatives = projects
    .filter((project) => project.id === "dengue-ewars")
    .map((project) => ({
      id: project.id,
      category: project.category,
      title: "Dengue Early Warning Signals in Nepal",
      summary: project.description,
      tags: project.tags,
    }));

  const orderedItems = [...items, ...researchInitiatives].sort((a, b) => {
    const order: Record<string, number> = {
      "ecoli-amr-generalization": 1,
      "dengue-nepal": 2,
      "dengue-ewars": 3,
      "caffeine-consumption-patterns-among-adults-in-siddharthanagar-09-bhairahawa-nepal": 4,
    };
    return (order[a.id] ?? 99) - (order[b.id] ?? 99);
  });

  const publicationById = new Map(publications.map((item) => [item.id, item] as const));

  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{page.eyebrow}</p>
        <h1 className="editorial-title">
          {page.title}
          {page.titleMuted && <><br /><span className="editorial-title-muted">{page.titleMuted}</span></>}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#62676f]">{page.intro}</p>

        <div className="mt-16 border-y border-[#bfb49e]">
          {orderedItems.map((item, index) => {
            const details = studyDetails[item.id];
            const publication = details?.publicationId
              ? publicationById.get(details.publicationId)
              : undefined;

            return (
              <article key={item.id} className="grid gap-6 border-b border-[#d7cdb9] py-10 last:border-b-0 md:grid-cols-[4rem_minmax(0,1fr)]">
                <span className="font-display text-2xl text-[#a5a397]">{displayNumber(index)}</span>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="editorial-kicker">{item.category} · Research study</p>
                    {(publication?.status || item.id === "dengue-ewars") && (
                      <span className="border border-[#cfc4ad] px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.1em] text-[#686b68]">
                        {publication?.status ?? "Independent research initiative"}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-3"><WorkMark kind={item.id === "ecoli-amr-generalization" ? "genomics" : item.id === "dengue-nepal" ? "epidemiology" : item.id === "dengue-ewars" ? "signal" : "survey"} /><h2 className="max-w-4xl font-display text-2xl leading-tight md:text-3xl">{item.title}</h2></div>
                  <p className="mt-4 max-w-4xl text-[0.98rem] leading-7 text-[#555b67]">{item.summary}</p>

                  {details && (
                    <dl className="mt-7 grid gap-5 border-y border-[#d7cdb9] py-5 sm:grid-cols-3">
                      <div>
                        <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#9a742d]">Study material</dt>
                        <dd className="mt-2 text-sm leading-6 text-[#454a55]">{details.material}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#9a742d]">Approach</dt>
                        <dd className="mt-2 text-sm leading-6 text-[#454a55]">{details.method}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#9a742d]">Research question</dt>
                        <dd className="mt-2 text-sm leading-6 text-[#454a55]">{details.question}</dd>
                      </div>
                    </dl>
                  )}

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {publication?.links.filter((link) => link.url).map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9a742d] hover:text-[#72521c]">
                        {link.label} ↗
                      </a>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.65rem] uppercase tracking-[0.12em] text-[#85857d]">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-6 text-[#777b86]">
          Publication records and links are shown with each study. “Under review” describes the current editorial process, not an acceptance decision.
        </p>
      </div>
    </main>
  );
}
