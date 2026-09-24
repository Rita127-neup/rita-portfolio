const projects = [
  {
    number: "01",
    category: "COMPUTATIONAL BIOLOGY",
    title: "E. coli Antimicrobial Resistance",
    description:
      "A machine-learning study of genomic prediction for ciprofloxacin resistance in E. coli, focusing on geographic generalization, model calibration, and population shift.",
    tags: ["AMR", "Machine Learning", "Genomics", "Python"],
    status: "Research",
  },
  {
    number: "02",
    category: "PUBLIC HEALTH",
    title: "Dengue Lens Nepal",
    description:
      "A public-data project exploring dengue surveillance in Nepal through data analysis, visualization, and accessible public-health information.",
    tags: ["Dengue", "Public Health", "Data", "Nepal"],
    status: "Independent Project",
  },
  {
    number: "03",
    category: "EPIDEMIOLOGY",
    title: "Dengue Fever in Nepal",
    description:
      "An analysis of national dengue surveillance data from 2019–2024, investigating temporal patterns and relationships between dengue cases and environmental variables.",
    tags: ["Epidemiology", "Statistics", "Public Health"],
    status: "Research",
  },
  {
    number: "04",
    category: "HEALTH DATA",
    title: "Caffeine Consumption Study",
    description:
      "A community-based study examining caffeine consumption patterns, sources, motivations, and related behaviors among adults in Siddharthanagar, Nepal.",
    tags: ["Survey Research", "Statistics", "Public Health"],
    status: "Published Research",
  },
  {
    number: "05",
    category: "MACHINE LEARNING",
    title: "Health Prediction Models",
    description:
      "Machine-learning projects exploring symptom-based disease prediction and mental-health prediction using structured health data.",
    tags: ["Machine Learning", "Python", "Health Data"],
    status: "Independent Project",
  },
];

export default function Projects() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Projects
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Things I&apos;ve built,
            <br />
            <span className="text-slate-400">studied, and explored.</span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-400">
            A collection of my research, computational projects, and
            data-driven work across biology, public health, and machine
            learning.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.number}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="absolute right-8 top-8 text-4xl font-semibold text-white/5 transition group-hover:text-cyan-400/10">
                {project.number}
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                    {project.category}
                  </p>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                    {project.status}
                  </span>
                </div>

                <h2 className="mt-8 max-w-lg text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.title}
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10">
                  <button className="text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                    View project →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}