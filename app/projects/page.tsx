import Link from "next/link";
import { getProjectsContent } from "@/lib/content";
import { ProjectVisual } from "@/app/_components/project-visual";

export default async function Projects() {
  const { page, items: projects } = await getProjectsContent();

  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{page.eyebrow}</p>
        <h1 className="editorial-title">
          {page.title}
          <br />
          <span className="editorial-title-muted">{page.titleMuted}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#62676f]">{page.intro}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              id={project.id}
              href={"/projects#" + project.id}
              className="group overflow-hidden rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(50,43,30,0.10)]"
            >
              <ProjectVisual
                id={project.id}
                imageId={project.imageId}
                title={project.title}
                category={project.category}
                compact
              />
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a742d]">
                  {project.status}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-[#9a742d]">
                  {project.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#666c78]">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d7cdb9] px-2.5 py-1 text-[10px] text-[#62676f]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a742d]">
                  Explore ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
