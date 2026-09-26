import { displayNumber, getProjectsContent } from "@/lib/content";

export default async function Projects() {
  const { page, items: projects } = await getProjectsContent();

  return (
    <main className="min-h-screen bg-[#f7f1df] px-6 py-16 md:py-20 text-[#202033]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#9a742d]">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">
            {page.title}
            {page.titleMuted && (
              <>
                <br />
                <span className="text-[#5e6270]">{page.titleMuted}</span>
              </>
            )}
          </h1>

          <p className="mt-8 text-lg leading-8 text-[#5e6270]">{page.intro}</p>
        </div>

        <div className="mt-14 md:mt-12 md:mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#9a742d]/30"
            >
              <div className="absolute right-8 top-8 text-4xl font-semibold text-[#202033]/5 transition group-hover:text-cyan-400/10">
                {displayNumber(index)}
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9a742d]">
                    {project.category}
                  </p>

                  <span className="rounded-full border border-[#d8cfbb] px-3 py-1 text-xs text-[#777b86]">
                    {project.status}
                  </span>
                </div>

                <h2 className="mt-8 max-w-lg text-2xl font-semibold tracking-[-0.02em] tracking-[-0.02em] md:text-3xl">
                  {project.title}
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-[#5e6270]">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d8cfbb] px-3 py-1.5 text-xs text-[#5e6270]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10">
                  <button className="text-sm font-medium text-[#9a742d] transition group-hover:text-[#76571e]">
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
