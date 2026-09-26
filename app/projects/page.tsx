import Image from "next/image";
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

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <article key={project.id} className="group overflow-hidden rounded-[1.5rem] border border-[#d8cfbb] bg-[#fbf6e8] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(50,43,30,0.10)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e9e1cf]">
                {project.imageId ? (
                  <Image src={"/media/project/" + project.id + "?v=" + project.imageId} alt={project.title} fill unoptimized className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#e8dfcb] via-[#f3ead8] to-[#d8c9ab]"><span className="font-display text-7xl text-[#9a742d]/30">{String(index + 1).padStart(2, "0")}</span></div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#202033]/60 to-transparent p-5 pt-16">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">{project.category}</p>
                  <span className="text-xs text-white/80">{project.status}</span>
                </div>
              </div>
              <div className="p-7 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-xl text-[#9a9d97]">{displayNumber(index)}</span>
                  <span className="text-xs text-[#777b86]">Project ↗</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{project.title}</h2>
                <p className="mt-4 leading-7 text-[#5e6270]">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => <span key={tag} className="rounded-full border border-[#d8cfbb] px-3 py-1.5 text-xs text-[#5e6270]">{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
