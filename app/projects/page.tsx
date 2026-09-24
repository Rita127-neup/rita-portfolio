import { displayNumber, getProjectsContent } from "@/lib/content";

export default async function Projects() {
  const { page, items: projects } = await getProjectsContent();

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            {page.title}
            {page.titleMuted && (
              <>
                <br />
                <span className="text-slate-400">{page.titleMuted}</span>
              </>
            )}
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-400">{page.intro}</p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="absolute right-8 top-8 text-4xl font-semibold text-white/5 transition group-hover:text-cyan-400/10">
                {displayNumber(index)}
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
